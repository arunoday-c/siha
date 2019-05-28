import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

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

class OrderMedication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      patient_id: Window.global["current_patient"],
      encounter_id: Window.global["encounter_id"],
      visit_id: Window.global["visit_id"],

      provider_id: Window.global["provider_id"],
      episode_id: Window.global["episode_id"],

      vat_applicable: this.props.vat_applicable,

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
      Instructions: null,
      total_quantity: 0
    };
  }

  componentDidMount() {
    this.props.getItems({
      uri: "/pharmacy/getItemMaster",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ITEMS_GET_DATA",
        mappingName: "itemlist"
      },
      afterSuccess: data => {
        this.setState({
          itemlist: data
        });
      }
    });
    this.props.getGenerics({
      uri: "/pharmacy/getItemGeneric",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "GENERIC_GET_DATA",
        mappingName: "genericlist"
      }
    });
    this.getPatientInsurance();
  }

  getPatientInsurance() {
    debugger;
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

  componentWillReceiveProps(nextProps) {
    debugger;

    if (
      nextProps.existinginsurance !== undefined &&
      nextProps.existinginsurance.length !== 0
    ) {
      let output = nextProps.existinginsurance[0];
      output.insured = "Y";
      this.setState({ ...output });
    }
  }

  render() {
    return (
      <div>
        <div className="popupInner">
          <div className="popRightDiv">
            <div className="row paddin-bottom-5" style={{ marginTop: 5 }}>
              <AlagehAutoComplete
                div={{ className: "col-3" }}
                label={{ forceLabel: "Generic Name" }}
                selector={{
                  name: "generic_id",
                  className: "select-fld",
                  value: this.state.generic_id,
                  dataSource: {
                    textField: "generic_name",
                    valueField: "hims_d_item_generic_id",
                    data: this.props.genericlist
                  },
                  onChange: genericnamehandle.bind(this, this),
                  autoComplete: "off"
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col-3" }}
                label={{ forceLabel: "Item Name" }}
                selector={{
                  name: "item_id",
                  className: "select-fld",
                  value: this.state.item_id,
                  dataSource: {
                    textField: "item_description",
                    valueField: "hims_d_item_master_id",
                    data: this.state.itemlist
                  },
                  onChange: itemhandle.bind(this, this),
                  onClear: itemhandle.bind(this, this),
                  autoComplete: "off"
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col" }}
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
                div={{ className: "col" }}
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
                div={{ className: "col" }}
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
              />
            </div>
            <div className="row paddin-bottom-5">
              <AlagehFormGroup
                div={{ className: "col" }}
                label={{
                  forceLabel: "Dosage"
                }}
                textBox={{
                  className: "txt-fld",
                  name: "dosage",
                  value: this.state.dosage,
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

              <AlagehFormGroup
                div={{ className: "col" }}
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
                div={{ className: "col" }}
                label={{ forceLabel: "Start Date" }}
                textBox={{ className: "txt-fld", name: "start_date" }}
                minDate={new Date()}
                events={{
                  onChange: datehandle.bind(this, this)
                }}
                value={this.state.start_date}
              />

              <AlagehFormGroup
                div={{ className: "col-4 form-group" }}
                label={{
                  forceLabel: "Instruction",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "instructions",
                  value: this.state.instructions,
                  events: {
                    onChange: texthandle.bind(this, this)
                  },
                  option: {
                    type: "text"
                  }
                }}
              />

              <div className="col" style={{ paddingTop: 21, paddingLeft: 0 }}>
                <button
                  className="btn btn-default btn-sm"
                  type="button"
                  onClick={AddItems.bind(this, this)}
                  disabled={this.state.addItemEnable}
                >
                  Add Item
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12" style={{ marginTop: 10 }}>
                <AlgaehDataGrid
                  id="Order_Medication"
                  columns={[
                    {
                      fieldName: "generic_id",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Generic Name" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.genericlist === undefined
                            ? []
                            : this.props.genericlist.filter(
                                f => f.hims_d_item_generic_id === row.generic_id
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].generic_name
                              : ""}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        let display =
                          this.props.genericlist === undefined
                            ? []
                            : this.props.genericlist.filter(
                                f => f.hims_d_item_generic_id === row.generic_id
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
                        <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.state.itemlist === undefined
                            ? []
                            : this.state.itemlist.filter(
                                f => f.hims_d_item_master_id === row.item_id
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].item_description
                              : ""}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        let display =
                          this.state.itemlist === undefined
                            ? []
                            : this.state.itemlist.filter(
                                f => f.hims_d_item_master_id === row.item_id
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].item_description
                              : ""}
                          </span>
                        );
                      }
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
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{}}
                            textBox={{
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
                      editorTemplate: row => {
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
                      editorTemplate: row => {
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
            <div className="row" style={{ marginTop: 5, marginBottom: 5 }}>
              <div className="col">
                <p>Pharmacy Stock: {this.state.total_quantity}</p>
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
              className="btn btn-default"
              type="button"
              onClick={printPrescription.bind(this, this)}
              disabled={this.state.saveMedicationEnable}
            >
              Print Prescription
            </button>
            <button
              type="button"
              className="btn btn-default"
              onClick={e => {
                this.props.onclosePopup && this.props.onclosePopup(e);
              }}
            >
              Cancel
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
      getItems: AlgaehActions,
      getGenerics: AlgaehActions,
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
