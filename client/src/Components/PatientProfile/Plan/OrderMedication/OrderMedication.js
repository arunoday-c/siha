import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Swal from "sweetalert2";
import {
  PRESCRIPTION_FREQ_PERIOD,
  PRESCRIPTION_FREQ_TIME,
  PRESCRIPTION_FREQ_DURATION
} from "../../../../utils/GlobalVariables.json";

import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";

import {
  texthandle,
  genericnamehandle,
  itemhandle,
  AddItems,
  deleteItems,
  datehandle,
  SaveMedication,
  printPrescription,
  dateFormater,
  numberhandle,
  calcuateDispense,
  updateItems,
  onchangegridcol,
  EditGrid,
  CancelGrid
} from "./OrderMedicationEvents";
import "./OrderMedication.css";
import "../../../../styles/site.css";
import { AlgaehActions } from "../../../../actions/algaehActions";
import moment from "moment";
import AlgaehAutoSearch from "../../../Wrapper/autoSearch";
import _ from "lodash";
import { Label } from "semantic-ui-react";
import ButtonType from "../../../Wrapper/algaehButton";
import { setGlobal, removeGlobal } from "../../../../utils/GlobalFunctions";
class OrderMedication extends Component {
  constructor(props) {
    super(props);
    let storedState = {};
    if (Window.global["orderMedicationState"] !== null) {
      storedState = Window.global["orderMedicationState"];
      removeGlobal("orderMedicationState");
    }
    this.state = {
      patient_id: Window.global["current_patient"],
      encounter_id: Window.global["encounter_id"],
      visit_id: Window.global["visit_id"],

      provider_id: Window.global["provider_id"],
      episode_id: Window.global["episode_id"],

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
      frequency: null,
      no_of_days: 0,
      dispense: 0,

      frequency_type: null,
      frequency_time: null,
      total_quantity: 0,
      ...storedState
    };
  }

  componentDidMount() {
    this.getPatientInsurance();
  }
  onGenericItemSelectedHandler(item) {
    this.setState({
      generic_id: item.hims_d_item_generic_id,
      generic_name: _.startCase(_.toLower(item.generic_name))
    });
  }
  clearGenericCodeHandler() {
    this.setState({
      generic_id: undefined,
      generic_name: "",
      item_description: "",
      item_id: undefined
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
      total_quantity: 0
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
        patient_visit_id: this.state.visit_id
      },
      redux: {
        type: "EXIT_INSURANCE_GET_DATA",
        mappingName: "existinginsurance"
      },
      afterSuccess: data => {
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
            secondary_network_office_id: data.secondary_network_office_id
          });
        }
      }
    });
  }
  componentWillUnmount() {
    setGlobal({ orderMedicationState: this.state });
  }
  componentWillReceiveProps(nextProps) {
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
      f => f.value === this.state.frequency
    );
    const frequencyType = _.find(
      PRESCRIPTION_FREQ_TIME,
      f => f.value === this.state.frequency_type
    );
    const consume = _.find(
      PRESCRIPTION_FREQ_DURATION,
      f => f.value === this.state.frequency_time
    );
    if (frequency !== undefined && frequencyType !== undefined) {
      this.setState({
        instructions: `Use ${this.state.dosage} Unit(s),${
          frequency.name
        } Time(s) ${frequencyType.name} '${
          consume !== undefined ? consume.name : ""
        }' for ${this.state.no_of_days} day(s)`
      });
    }
  }

  onInstructionsTextHandler(e) {
    this.setState({
      instructions: e.currentTarget.value
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
      frequency: null,
      no_of_days: 0,
      dispense: null,
      frequency_type: null,
      frequency_time: null,
      uom_id: null,
      service_id: null,
      item_category_id: null,
      item_group_id: null,
      pre_approval: null,
      instructions: null,
      generic_name: "",
      item_description: "",
      instructions: "",
      total_quantity: 0
    });
  };

  clearAction = e => {
    {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, clear it!"
      }).then(result => {
        if (result.value) {
          this.setState(
            {
              saveMedicationEnable: true,
              medicationitems: []
            },
            this.clearInputState
          );
        }
      });
    }
  };

  render() {
    return (
      <div>
        <div className="popupInner">
          <div className="popRightDiv">
            <div className="row paddin-bottom-5" style={{ marginTop: 5 }}>
              <div className="col-8">
                <div className="row">
                  <AlgaehAutoSearch
                    div={{ className: "col-12" }}
                    label={{ forceLabel: "Generic Name / Item Name" }}
                    title="Search by generic name / item name"
                    name="generic_name_item_description"
                    columns={[
                      { fieldName: "item_description" },
                      { fieldName: "item_code" },
                      { fieldName: "sfda_code" },
                      {
                        fieldName: "generic_name"
                      }
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
                      generic_name
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
                    div={{ className: "col-4" }}
                    label={{ forceLabel: "Frequency" }}
                    selector={{
                      name: "frequency",
                      className: "select-fld",
                      value: this.state.frequency,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: PRESCRIPTION_FREQ_PERIOD
                      },
                      onChange: texthandle.bind(this, this),
                      autoComplete: "off"
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-4" }}
                    label={{ forceLabel: "Freq. Type" }}
                    selector={{
                      name: "frequency_type",
                      className: "select-fld",
                      value: this.state.frequency_type,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: PRESCRIPTION_FREQ_TIME
                      },
                      onChange: texthandle.bind(this, this),
                      autoComplete: "off"
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-4" }}
                    label={{ forceLabel: "Consume" }}
                    selector={{
                      name: "frequency_time",
                      className: "select-fld",
                      value: this.state.frequency_time,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: PRESCRIPTION_FREQ_DURATION
                      },
                      onChange: texthandle.bind(this, this),
                      autoComplete: "off"
                    }}
                  />{" "}
                  <AlagehFormGroup
                    div={{ className: "col-4" }}
                    label={{
                      forceLabel: "Dosage"
                    }}
                    textBox={{
                      number: true,
                      className: "txt-fld",
                      name: "dosage",
                      value: this.state.dosage,
                      events: {
                        onChange: numberhandle.bind(this, this)
                      },
                      others: {
                        min: 1,
                        onFocus: e => {
                          e.target.oldvalue = e.target.value;
                        }
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-4" }}
                    label={{
                      forceLabel: "Duration (Days)"
                    }}
                    textBox={{
                      number: { allowNegative: false },
                      className: "txt-fld",
                      name: "no_of_days",
                      value: this.state.no_of_days,
                      events: {
                        onChange: numberhandle.bind(this, this)
                      },
                      others: {
                        onFocus: e => {
                          e.target.oldvalue = e.target.value;
                        }
                      }
                    }}
                  />
                  <AlgaehDateHandler
                    div={{ className: "col-4" }}
                    label={{ forceLabel: "Start Date" }}
                    textBox={{ className: "txt-fld", name: "start_date" }}
                    minDate={new Date()}
                    events={{
                      onChange: datehandle.bind(this, this)
                    }}
                    dontAllow={"past"}
                    value={this.state.start_date}
                  />
                </div>
              </div>
              <div className="col-4">
                <div className="row">
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
                    <span style={{ textAlign: "left" }}>
                      Pharmacy Stock: <b>{this.state.total_quantity}</b>
                    </span>
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
            <div className="row paddin-bottom-5" />
            <div className="row">
              <div className="col-lg-12" style={{ marginTop: 10 }}>
                <AlgaehDataGrid
                  id="Order_Medication"
                  columns={[
                    {
                      fieldName: "generic_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Generic Name" }} />
                      ),
                      editorTemplate: row => <span>{row.generic_name}</span>
                    },
                    {
                      fieldName: "item_description",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                      ),
                      editorTemplate: row => <span>{row.item_description}</span>
                    },
                    {
                      fieldName: "frequency",
                      label: <AlgaehLabel label={{ forceLabel: "Freq." }} />,
                      displayTemplate: row => {
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
                          : null;
                      },
                      editorTemplate: row => {
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
                          : null;
                      },
                      others: {
                        minWidth: 50
                      }
                    },
                    {
                      fieldName: "frequency_type",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Freq. Type" }} />
                      ),
                      displayTemplate: row => {
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
                          : null;
                      },
                      editorTemplate: row => {
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
                          : null;
                      },
                      others: {
                        minWidth: 70
                      }
                    },
                    {
                      fieldName: "frequency_time",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Freq. Time" }} />
                      ),
                      displayTemplate: row => {
                        return row.frequency_time === "BM"
                          ? "Before Meals"
                          : row.frequency_time === "AM"
                          ? "After Meals"
                          : null;
                      },
                      editorTemplate: row => {
                        return row.frequency_time === "BM"
                          ? "Before Meals"
                          : row.frequency_time === "AM"
                          ? "After Meals"
                          : null;
                      },
                      others: {
                        minWidth: 70
                      }
                    },
                    {
                      fieldName: "dosage",
                      label: <AlgaehLabel label={{ forceLabel: "Dosage" }} />,
                      others: {
                        minWidth: 50
                      },
                      displayTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{}}
                            textBox={{
                              number: { allowNegative: false },
                              value: row.dosage,
                              className: "txt-fld",
                              name: "dosage",
                              events: {
                                onChange: onchangegridcol.bind(this, this, row)
                              }
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "no_of_days",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Duration (Days)" }}
                        />
                      ),
                      others: {
                        minWidth: 90
                      },
                      displayTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{}}
                            textBox={{
                              number: { allowNegative: false },
                              value: row.no_of_days,
                              className: "txt-fld",
                              name: "no_of_days",
                              events: {
                                onChange: onchangegridcol.bind(this, this, row)
                              }
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "start_date",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Start Date" }} />
                      ),
                      displayTemplate: row => {
                        return <span>{dateFormater(row.start_date)}</span>;
                      },
                      editorTemplate: row => {
                        return <span>{dateFormater(row.start_date)}</span>;
                      },
                      others: {
                        minWidth: 100
                      }
                    },
                    {
                      fieldName: "pre_approval",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Pre Approval" }} />
                      ),
                      displayTemplate: row => {
                        return row.pre_approval === "Y"
                          ? "Required"
                          : "Not Required";
                      },
                      editorTemplate: row => {
                        return row.pre_approval === "Y"
                          ? "Required"
                          : "Not Required";
                      }
                    },
                    {
                      fieldName: "instructions",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Instruction" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{}}
                            textBox={{
                              value: row.instructions,
                              className: "txt-fld",
                              name: "instructions",
                              events: {
                                onChange: onchangegridcol.bind(this, this, row)
                              }
                            }}
                          />
                        );
                      }
                    }
                  ]}
                  keyId="item_id"
                  dataSource={{
                    data: this.state.medicationitems
                  }}
                  actions={{
                    allowEdit: false
                  }}
                  isEditable={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  byForceEvents={true}
                  events={{
                    onDelete: deleteItems.bind(this, this),
                    onEdit: EditGrid.bind(this, this),
                    onCancel: CancelGrid.bind(this, this),
                    onDone: updateItems.bind(this, this)
                  }}
                />
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

            {/*<ButtonType
              label={{
                forceLabel: "Print Prescription",
                returnText: true
              }}
              isReport={true}
              displayName="Prescription"
              report={{
                reportName: "prescription",
                reportParams: [
                  {
                    name: "hims_d_patient_id",
                    value: Window.global["current_patient"]
                  },
                  {
                    name: "visit_id",
                    value: Window.global["visit_id"]
                  },
                  {
                    name: "visit_code",
                    value: null
                  }
                ],
                outputFileType: "PDF"
              }}
            />*/}
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
    existinginsurance: state.existinginsurance
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItemStock: AlgaehActions,
      getPatientInsurance: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrderMedication)
);
