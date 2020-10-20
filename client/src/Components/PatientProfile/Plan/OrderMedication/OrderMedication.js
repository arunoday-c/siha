import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Swal from "sweetalert2";
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
  AlagehAutoComplete,
  AlgaehDateHandler,
} from "../../../Wrapper/algaehWrapper";

import {
  texthandle,
  itemhandle,
  AddItems,
  // AddItemsOrUpdate,
  deleteItems,
  datehandle,
  SaveMedication,
  dateFormater,
  numberhandle,
  // updateItems,
  // onchangegridcol,
  // EditGrid,
  // CancelGrid,
} from "./OrderMedicationEvents";
import "./OrderMedication.scss";
import "../../../../styles/site.scss";
import { AlgaehActions } from "../../../../actions/algaehActions";
import moment from "moment";
import AlgaehAutoSearch from "../../../Wrapper/autoSearch";
import _ from "lodash";

import { setGlobal, removeGlobal } from "../../../../utils/GlobalFunctions";
class OrderMedication extends Component {
  constructor(props) {
    super(props);
    let storedState = {};
    if (Window.global["orderMedicationState"] !== null) {
      storedState = Window.global["orderMedicationState"];
      removeGlobal("orderMedicationState");
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
      medicationitems: [],
      start_date: moment(new Date())._d,
      saveMedicationEnable: true,
      uom_id: null,
      service_id: null,
      item_category_id: null,
      item_group_id: null,
      addItemEnable: true,

      item_id: null,
      generic_id: null,
      dosage: 1,
      med_units: null,
      frequency: null,
      no_of_days: 0,
      dispense: 0,

      updateButton: false,
      rowDetails: [],

      frequency_type: null,
      frequency_time: null,
      frequency_route: null,
      total_quantity: 0,
      ...storedState,
    };
  }

  componentDidMount() {
    this.getPatientInsurance();
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
    });
  }
  itemChangeHandle(item) {
    itemhandle(this, item);
  }

  getPatientInsurance() {
    this.props.getPatientInsurance({
      uri: "/patientRegistration/getPatientInsurance",
      module: "frontDesk",
      method: "GET",
      data: {
        patient_id: this.state.patient_id,
        patient_visit_id: this.state.visit_id,
      },
      redux: {
        type: "EXIT_INSURANCE_GET_DATA",
        mappingName: "existinginsurance",
      },
      afterSuccess: (data) => {
        if (data.length > 0) {
          this.setState({
            insured: "Y",
            primary_insurance_provider_id: data.insurance_provider_id,
            primary_network_office_id: data.hims_d_insurance_network_office_id,
            primary_network_id: data.network_id,
            sec_insured: data.sec_insured,
            secondary_insurance_provider_id:
              data.secondary_insurance_provider_id,
            secondary_network_id: data.secondary_network_id,
            secondary_network_office_id: data.secondary_network_office_id,
          });
        }
      },
    });
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

  clearInputState = () => {
    this.setState({
      generic_name_item_description: "",
      saveMedicationEnable: false,
      addItemEnable: true,
      item_id: null,
      generic_id: null,
      dosage: 1,
      med_units: null,
      frequency: null,
      no_of_days: 0,
      dispense: null,
      frequency_type: null,
      frequency_time: null,
      frequency_route: null,
      uom_id: null,
      service_id: null,
      item_category_id: null,
      item_group_id: null,
      pre_approval: null,
      generic_name: "",
      item_description: "",
      instructions: "",
      start_date: moment().format("YYYY-MM-DD"),
      total_quantity: 0,
    });
  };
  onEditRow(row) {
    this.setState({
      rowDetails: row,
      generic_name_item_description: row.generic_name,
      saveMedicationEnable: true,
      addItemEnable: false,
      item_id: row.item_id,
      generic_id: row.generic_id,
      frequency: row.frequency,
      dispense: row.dispense,
      uom_id: row.uom_id,
      service_id: row.service_id,
      item_category_id: row.item_category_id,
      item_group_id: row.item_group_id,
      pre_approval: row.pre_approval,
      frequency_type: row.frequency_type,
      frequency_time: row.frequency_time,
      frequency_route: row.frequency_route,
      dosage: row.dosage,
      item_description: row.item_description,
      // total_quantity:row.
      updateButton: true,
      generic_name: row.generic_name,
      med_units: row.med_units,
      no_of_days: row.no_of_days,
      start_date: row.start_date,
      instructions: row.instructions,
    });
  }
  clearAction = (e) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clear it!",
    }).then((result) => {
      if (result.value) {
        this.setState(
          {
            saveMedicationEnable: true,
            medicationitems: [],
          },
          this.clearInputState
        );
      }
    });
  };

  render() {
    return (
      <div>
        <div className="row popupInner">
          <div className="col-4">
            <div className="popLeftDiv">
              {" "}
              <div className="row">
                <AlgaehAutoSearch
                  div={{ className: "col-12 form-group" }}
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
                      <div className="col-12 padd-10">
                        <h6>
                          {_.startCase(_.toLower(generic_name))} &rArr;{" "}
                          <small>
                            {_.startCase(_.toLower(item_description))}
                          </small>
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
                <AlagehAutoComplete
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
                />{" "}
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
                />{" "}
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
                <AlgaehDateHandler
                  div={{ className: "col-6 form-group" }}
                  label={{ forceLabel: "Start Date" }}
                  textBox={{ className: "txt-fld", name: "start_date" }}
                  minDate={new Date()}
                  events={{
                    onChange: datehandle.bind(this, this),
                  }}
                  value={this.state.start_date}
                />
                <div className="col-12">
                  <label className="style_Label ">Instruction</label>
                  <textarea
                    name="instructions"
                    className="txt-fld"
                    rows="4"
                    onChange={this.onInstructionsTextHandler.bind(this)}
                    value={this.state.instructions}
                  />
                </div>{" "}
                <div
                  className="col-12"
                  style={{ paddingTop: 9, textAlign: "right" }}
                >
                  <span style={{ float: "left" }}>
                    Pharmacy Stock: <b>{this.state.total_quantity}</b>
                  </span>
                  <button
                    className="btn btn-primary btn-sm"
                    type="button"
                    onClick={AddItems.bind(this, this)}
                    disabled={this.state.addItemEnable}
                  >
                    {this.state.updateButton ? "Update" : "Add Item"}
                  </button>
                </div>
              </div>{" "}
            </div>
          </div>{" "}
          <div className="col-lg-8" style={{ paddingLeft: 0 }}>
            <div className="popRightDiv" style={{ paddingLeft: 0 }}>
              <div className="row">
                <div className="col-12" id="OrderMedicationGrid_Cntr">
                  <AlgaehDataGrid
                    id="OrderMedicationGrid"
                    columns={[
                      {
                        fieldName: "request_status",
                        label: "Actions",
                        sortable: true,
                        displayTemplate: (row) => {
                          return (
                            <>
                              <span onClick={() => this.onEditRow(row)}>
                                <i className="fas fa-pen"></i>
                              </span>
                              <span onClick={deleteItems.bind(this, this)}>
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
                        fieldName: "frequency",
                        label: <AlgaehLabel label={{ forceLabel: "Freq." }} />,
                        displayTemplate: (row) => {
                          return row.frequency === "0"
                            ? "1-0-1"
                            : row.frequency === "1"
                            ? "1-0-0"
                            : row.frequency === "2"
                            ? "0-0-1"
                            : row.frequency === "3"
                            ? "0-1-0"
                            : row.frequency === "4"
                            ? "1-1-0"
                            : row.frequency === "5"
                            ? "0-1-1"
                            : row.frequency === "6"
                            ? "1-1-1"
                            : row.frequency === "7"
                            ? "Once only"
                            : row.frequency === "8"
                            ? "Once daily (q24h)"
                            : row.frequency === "9"
                            ? "Twice daily (Bid)"
                            : row.frequency === "10"
                            ? "Three times daily (tid)"
                            : row.frequency === "11"
                            ? "Five times daily"
                            : row.frequency === "12"
                            ? "Every two hours (q2h)"
                            : row.frequency === "13"
                            ? "Every three hours (q3h)"
                            : row.frequency === "14"
                            ? "Every four hours (q4h)"
                            : row.frequency === "15"
                            ? "Every six hours (q6h)"
                            : row.frequency === "16"
                            ? "Every eight hours (q8h)"
                            : row.frequency === "17"
                            ? "Every twelve hours (q12h)"
                            : row.frequency === "18"
                            ? "Four times daily (qid)"
                            : row.frequency === "19"
                            ? "Other (According To Physician)"
                            : null;
                        },
                        // editorTemplate: (row) => {
                        //   return row.frequency === "0"
                        //     ? "1-0-1"
                        //     : row.frequency === "1"
                        //     ? "1-0-0"
                        //     : row.frequency === "2"
                        //     ? "0-0-1"
                        //     : row.frequency === "3"
                        //     ? "0-1-0"
                        //     : row.frequency === "4"
                        //     ? "1-1-0"
                        //     : row.frequency === "5"
                        //     ? "0-1-1"
                        //     : row.frequency === "6"
                        //     ? "1-1-1"
                        //     : row.frequency === "7"
                        //     ? "Once only"
                        //     : row.frequency === "8"
                        //     ? "Once daily (q24h)"
                        //     : row.frequency === "9"
                        //     ? "Twice daily (Bid)"
                        //     : row.frequency === "10"
                        //     ? "Three times daily (tid)"
                        //     : row.frequency === "11"
                        //     ? "Five times daily"
                        //     : row.frequency === "12"
                        //     ? "Every two hours (q2h)"
                        //     : row.frequency === "13"
                        //     ? "Every three hours (q3h)"
                        //     : row.frequency === "14"
                        //     ? "Every four hours (q4h)"
                        //     : row.frequency === "15"
                        //     ? "Every six hours (q6h)"
                        //     : row.frequency === "16"
                        //     ? "Every eight hours (q8h)"
                        //     : row.frequency === "17"
                        //     ? "Every twelve hours (q12h)"
                        //     : row.frequency === "18"
                        //     ? "Four times daily (qid)"
                        //     : row.frequency === "19"
                        //     ? "Other (According To Physician)"
                        //     : null;
                        // },
                        others: {
                          minWidth: 150,
                        },
                      },
                      {
                        fieldName: "frequency_type",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Freq. Type" }} />
                        ),
                        displayTemplate: (row) => {
                          return row.frequency_type === "PD"
                            ? "Per Day"
                            : row.frequency_type === "PH"
                            ? "Per Hour"
                            : row.frequency_type === "PW"
                            ? "Per Week"
                            : row.frequency_type === "PM"
                            ? "Per Month"
                            : row.frequency_type === "AD"
                            ? "Alternate Day"
                            : row.frequency_type === "2W"
                            ? "Every 2 weeks"
                            : row.frequency_type === "2M"
                            ? "Every 2 months"
                            : row.frequency_type === "3M"
                            ? "Every 3 months"
                            : row.frequency_type === "4M"
                            ? "Every 4 months"
                            : row.frequency_type === "6M"
                            ? "Every 6 months"
                            : null;
                        },
                        // editorTemplate: (row) => {
                        //   return row.frequency_type === "PD"
                        //     ? "Per Day"
                        //     : row.frequency_type === "PH"
                        //     ? "Per Hour"
                        //     : row.frequency_type === "PW"
                        //     ? "Per Week"
                        //     : row.frequency_type === "PM"
                        //     ? "Per Month"
                        //     : row.frequency_type === "AD"
                        //     ? "Alternate Day"
                        //     : row.frequency_type === "2W"
                        //     ? "Every 2 weeks"
                        //     : row.frequency_type === "2M"
                        //     ? "Every 2 months"
                        //     : row.frequency_type === "3M"
                        //     ? "Every 3 months"
                        //     : row.frequency_type === "4M"
                        //     ? "Every 4 months"
                        //     : row.frequency_type === "6M"
                        //     ? "Every 6 months"
                        //     : null;
                        // },
                        others: {
                          minWidth: 150,
                        },
                      },
                      {
                        fieldName: "frequency_time",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Freq. Time" }} />
                        ),
                        displayTemplate: (row) => {
                          return row.frequency_time === "BM"
                            ? "Before Meals"
                            : row.frequency_time === "AM"
                            ? "After Meals"
                            : row.frequency_time === "WF"
                            ? "With Food"
                            : row.frequency_time === "EM"
                            ? "Early Morning"
                            : row.frequency_time === "BB"
                            ? "Before Bed Time"
                            : row.frequency_time === "AB"
                            ? "At Bed Time"
                            : null;
                        },
                        // editorTemplate: (row) => {
                        //   return row.frequency_time === "BM"
                        //     ? "Before Meals"
                        //     : row.frequency_time === "AM"
                        //     ? "After Meals"
                        //     : row.frequency_time === "WF"
                        //     ? "With Food"
                        //     : row.frequency_time === "EM"
                        //     ? "Early Morning"
                        //     : row.frequency_time === "BB"
                        //     ? "Before Bed Time"
                        //     : row.frequency_time === "AB"
                        //     ? "At Bed Time"
                        //     : null;
                        // },
                        others: {
                          minWidth: 100,
                        },
                      },
                      {
                        fieldName: "frequency_route",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Freq. Route" }} />
                        ),
                        displayTemplate: (row) => {
                          return row.frequency_route === "BL"
                            ? "Buccal"
                            : row.frequency_route === "EL"
                            ? "Enteral"
                            : row.frequency_route === "IL"
                            ? "Inhalation"
                            : row.frequency_route === "IF"
                            ? "Infusion"
                            : row.frequency_route === "IM"
                            ? "Intramuscular Inj"
                            : row.frequency_route === "IT"
                            ? "Intrathecal Inj"
                            : row.frequency_route === "IR"
                            ? "Intravenous Inj"
                            : row.frequency_route === "NL"
                            ? "Nasal"
                            : row.frequency_route === "OP"
                            ? "Ophthalmic"
                            : row.frequency_route === "OR"
                            ? "Oral"
                            : row.frequency_route === "OE"
                            ? "Otic (ear)"
                            : row.frequency_route === "RL"
                            ? "Rectal"
                            : row.frequency_route === "ST"
                            ? "Subcutaneous"
                            : row.frequency_route === "SL"
                            ? "Sublingual"
                            : row.frequency_route === "TL"
                            ? "Topical"
                            : row.frequency_route === "TD"
                            ? "Transdermal"
                            : null;
                        },
                        // editorTemplate: (row) => {
                        //   return row.frequency_route === "BL"
                        //     ? "Buccal"
                        //     : row.frequency_route === "EL"
                        //     ? "Enteral"
                        //     : row.frequency_route === "IL"
                        //     ? "Inhalation"
                        //     : row.frequency_route === "IF"
                        //     ? "Infusion"
                        //     : row.frequency_route === "IM"
                        //     ? "Intramuscular Inj"
                        //     : row.frequency_route === "IT"
                        //     ? "Intrathecal Inj"
                        //     : row.frequency_route === "IR"
                        //     ? "Intravenous Inj"
                        //     : row.frequency_route === "NL"
                        //     ? "Nasal"
                        //     : row.frequency_route === "OP"
                        //     ? "Ophthalmic"
                        //     : row.frequency_route === "OR"
                        //     ? "Oral"
                        //     : row.frequency_route === "OE"
                        //     ? "Otic (ear)"
                        //     : row.frequency_route === "RL"
                        //     ? "Rectal"
                        //     : row.frequency_route === "ST"
                        //     ? "Subcutaneous"
                        //     : row.frequency_route === "SL"
                        //     ? "Sublingual"
                        //     : row.frequency_route === "TL"
                        //     ? "Topical"
                        //     : row.frequency_route === "TD"
                        //     ? "Transdermal"
                        //     : null;
                        // },
                        others: {
                          minWidth: 100,
                        },
                      },
                      {
                        fieldName: "dosage",
                        label: <AlgaehLabel label={{ forceLabel: "Dosage" }} />,
                        others: {
                          minWidth: 70,
                        },
                        // displayTemplate: (row) => {
                        //   return (
                        //     <AlagehFormGroup
                        //       div={{}}
                        //       textBox={{
                        //         number: { allowNegative: false },
                        //         value: row.dosage,
                        //         className: "txt-fld",
                        //         name: "dosage",
                        //         events: {
                        //           onChange: onchangegridcol.bind(
                        //             this,
                        //             this,
                        //             row
                        //           ),
                        //         },
                        //       }}
                        //     />
                        //   );
                        // },
                      },
                      {
                        fieldName: "med_units",
                        label: <AlgaehLabel label={{ forceLabel: "Units" }} />,
                        others: {
                          minWidth: 40,
                        },
                        // displayTemplate: (row) => {
                        //   return (
                        //     <AlagehFormGroup
                        //       div={{}}
                        //       textBox={{
                        //         value: row.med_units,
                        //         className: "txt-fld",
                        //         name: "med_units",
                        //         others: {
                        //           maxLength: 10,
                        //           placeHolder: "ml, drops etc",
                        //         },
                        //         events: {
                        //           onChange: onchangegridcol.bind(
                        //             this,
                        //             this,
                        //             row
                        //           ),
                        //         },
                        //       }}
                        //     />
                        //   );
                        // },
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
                        // displayTemplate: (row) => {
                        //   return (
                        //     <AlagehFormGroup
                        //       div={{}}
                        //       textBox={{
                        //         number: { allowNegative: false },
                        //         value: row.no_of_days,
                        //         className: "txt-fld",
                        //         name: "no_of_days",
                        //         events: {
                        //           onChange: onchangegridcol.bind(
                        //             this,
                        //             this,
                        //             row
                        //           ),
                        //         },
                        //       }}
                        //     />
                        //   );
                        // },
                      },
                      {
                        fieldName: "start_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Start Date" }} />
                        ),
                        displayTemplate: (row) => {
                          return <span>{dateFormater(row.start_date)}</span>;
                        },
                        // editorTemplate: (row) => {
                        //   return <span>{dateFormater(row.start_date)}</span>;
                        // },
                        others: {
                          minWidth: 100,
                        },
                      },
                      {
                        fieldName: "pre_approval",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Pre Approval" }} />
                        ),
                        displayTemplate: (row) => {
                          return row.pre_approval === "Y"
                            ? "Required"
                            : "Not Required";
                        },
                        // editorTemplate: (row) => {
                        //   return row.pre_approval === "Y"
                        //     ? "Required"
                        //     : "Not Required";
                        // },
                      },
                      {
                        fieldName: "instructions",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Instruction" }} />
                        ),
                        // displayTemplate: (row) => {
                        //   return (
                        //     <AlagehFormGroup
                        //       div={{}}
                        //       textBox={{
                        //         value: row.instructions,
                        //         className: "txt-fld",
                        //         name: "instructions",
                        //         events: {
                        //           onChange: onchangegridcol.bind(
                        //             this,
                        //             this,
                        //             row
                        //           ),
                        //         },
                        //       }}
                        //     />
                        //   );
                        // },
                        others: {
                          minWidth: 200,
                        },
                      },
                    ]}
                    keyId="item_id"
                    dataSource={{
                      data: this.state.medicationitems,
                    }}
                    // actions={{
                    //   allowEdit: false,
                    // }}
                    // isEditable={true}
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
        <div className="popupFooter">
          <div className="col-lg-12">
            <button
              className="btn btn-primary"
              type="button"
              onClick={SaveMedication.bind(this, this)}
              disabled={this.state.saveMedicationEnable}
            >
              Save Medication
            </button>

            <button
              type="button"
              className="btn btn-default"
              onClick={this.clearAction}
            >
              Clear
            </button>
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
      getPatientInsurance: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OrderMedication)
);
