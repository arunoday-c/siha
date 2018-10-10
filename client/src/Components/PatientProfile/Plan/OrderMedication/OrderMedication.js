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
  dateFormater
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

      provider_id: Window.global["provider_id"],
      episode_id: Window.global["episode_id"],

      itemlist: [],
      medicationitems: [],
      start_date: moment(new Date())._d,
      savebutton: true,
      uom_id: null,
      service_id: null
    };
  }

  componentDidMount() {
    this.props.getItems({
      uri: "/pharmacy/getItemMaster",
      method: "GET",
      redux: {
        type: "ITEMS_GET_DATA",
        mappingName: "itemlist"
      },
      afterSuccess: data => {
        debugger;
        this.setState({
          itemlist: data
        });
      }
    });
    this.props.getGenerics({
      uri: "/pharmacy/getItemGeneric",
      method: "GET",
      redux: {
        type: "GENERIC_GET_DATA",
        mappingName: "genericlist"
      }
    });
  }

  render() {
    return (
      <div className="hptl-phase1-order-medication-form">
        <div className="col-lg-12">
          <div className="row">
            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
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
                onChange: genericnamehandle.bind(this, this)
              }}
            />

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
                  data: this.state.itemlist
                },
                onChange: itemhandle.bind(this, this)
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-lg-2" }}
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
                onChange: texthandle.bind(this, this)
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col-lg-2" }}
              label={{ forceLabel: "&nbsp;" }}
              selector={{
                name: "frequency_type",
                className: "select-fld",
                value: this.state.frequency_type,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: PRESCRIPTION_FREQ_TIME
                },
                onChange: texthandle.bind(this, this)
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col-lg-2" }}
              label={{ forceLabel: "&nbsp;" }}
              selector={{
                name: "frequency_time",
                className: "select-fld",
                value: this.state.frequency_time,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: PRESCRIPTION_FREQ_DURATION
                },
                onChange: texthandle.bind(this, this)
              }}
            />
          </div>
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Dosage"
              }}
              textBox={{
                className: "txt-fld",
                name: "dosage",
                value: this.state.dosage,
                events: {
                  onChange: texthandle.bind(this, this)
                }
              }}
            />

            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Duration (Days)"
              }}
              textBox={{
                className: "txt-fld",
                name: "no_of_days",
                value: this.state.no_of_days,
                events: {
                  onChange: texthandle.bind(this, this)
                }
              }}
            />

            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Total Quantity"
              }}
              textBox={{
                className: "txt-fld",
                name: "dispense",
                value: this.state.dispense,
                events: {
                  onChange: texthandle.bind(this, this)
                }
              }}
            />

            <AlgaehDateHandler
              div={{ className: "col-lg-3" }}
              label={{ forceLabel: "Start Date" }}
              textBox={{ className: "txt-fld", name: "start_date" }}
              maxDate={new Date()}
              events={{
                onChange: datehandle.bind(this, this)
              }}
              value={this.state.start_date}
            />
          </div>
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col-lg-10" }}
              label={{
                forceLabel: "Instructions"
              }}
              textBox={{
                className: "txt-fld",
                name: "followup_comments",
                value: this.state.followup_comments,
                events: {
                  onChange: texthandle.bind(this, this)
                }
              }}
            />

            <div className="col-lg-2" style={{ paddingTop: "4vh" }}>
              <button
                className="btn btn-primary btn-sm"
                type="button"
                onClick={AddItems.bind(this, this)}
              >
                Add Item
              </button>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="row">
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
                    }
                  },
                  {
                    fieldName: "item_id",
                    label: <AlgaehLabel label={{ forceLabel: "Item Name" }} />,
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
                    disabled: true
                  },
                  {
                    fieldName: "frequency",
                    label: <AlgaehLabel label={{ forceLabel: "Frequency" }} />,
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
                      <AlgaehLabel label={{ forceLabel: "Frequency Type" }} />
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
                      <AlgaehLabel label={{ forceLabel: "Frequency Time" }} />
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
                    label: <AlgaehLabel label={{ forceLabel: "Dosage" }} />
                  },
                  {
                    fieldName: "no_of_days",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Duration (Days)" }} />
                    )
                  },
                  {
                    fieldName: "start_date",
                    label: <AlgaehLabel label={{ forceLabel: "Start Date" }} />,
                    displayTemplate: row => {
                      return <span>{dateFormater(row.start_date)}</span>;
                    }
                  }
                ]}
                keyId="item_id"
                dataSource={{
                  data: this.state.medicationitems
                }}
                // isEditable={true}
                paging={{ page: 0, rowsPerPage: 3 }}
                events={{
                  onDelete: deleteItems.bind(this, this),
                  onEdit: row => {}
                  // onDone: this.updateBillDetail.bind(this)
                }}
              />
            </div>
          </div>
        </div>
        <div
          className="container-fluid"
          style={{ marginBottom: "1vh", marginTop: "1vh" }}
        >
          <div className="row" position="fixed">
            <div className="col-lg-12">
              <span className="float-right">
                <button
                  style={{ marginRight: "15px" }}
                  className="htpl1-phase1-btn-primary"
                  onClick={SaveMedication.bind(this, this)}
                  disabled={this.state.saved}
                >
                  <AlgaehLabel label={{ fieldName: "btnsave" }} />
                </button>
              </span>
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
    genericlist: state.genericlist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getGenerics: AlgaehActions
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
