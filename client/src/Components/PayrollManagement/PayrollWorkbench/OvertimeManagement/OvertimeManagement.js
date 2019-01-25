import React, { Component } from "react";
import "./ot_mgmt.css";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import { getYears } from "../../../../utils/GlobalFunctions";
import GlobalVariables from "../../../../utils/GlobalVariables.json";

import moment from "moment";

import {
  texthandle,
  employeeSearch,
  getOptions,
  CalculateAdd,
  clearOtValues,
  getOvertimeGroups,
  getHolidayMaster,
  datehandle,
  timetexthandle,
  DisplayDateFormat
} from "./OvertimeManagementEvent";
class OvertimeManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: moment().year(),
      month: moment(new Date()).format("M"),
      overtime_type: null,
      ot_calc_value: null,
      weekoff_calc_value: null,
      holiday_calc_value: null,

      ot_value: null,
      weekoff_value: null,
      holiday_value: null,
      monthlyOverTime: [],
      monthcalculateBtn: true,
      total_hours: null,
      total_holoday: null,
      total_weeloff: null,
      select_date: null,
      from_time: null,
      to_time: null,
      holidays: []
    };
  }

  componentDidMount() {
    getHolidayMaster(this, this);
    getOptions(this, this);
  }
  render() {
    debugger;
    let allYears = getYears();
    return (
      <div className="ot_mgmt">
        <div className="row  inner-top-search">
          <div className="col-3" style={{ marginTop: 10 }}>
            <div
              className="row"
              style={{
                border: " 1px solid #ced4d9",
                borderRadius: 5,
                marginLeft: 0
              }}
            >
              <div className="col">
                <AlgaehLabel label={{ forceLabel: "Employee Name" }} />
                <h6>
                  {this.state.employee_name
                    ? this.state.employee_name
                    : "------"}
                </h6>
              </div>
              <div
                className="col-lg-3"
                style={{ borderLeft: "1px solid #ced4d8" }}
              >
                <i
                  className="fas fa-search fa-lg"
                  style={{
                    paddingTop: 17,
                    paddingLeft: 3,
                    cursor: "pointer"
                  }}
                  onClick={employeeSearch.bind(this, this)}
                />
              </div>
            </div>
          </div>
          <AlagehAutoComplete
            div={{ className: "col-2" }}
            label={{
              forceLabel: "Select a Year.",
              isImp: true
            }}
            selector={{
              name: "year",
              className: "select-fld",
              value: this.state.year,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: allYears
              },
              onChange: texthandle.bind(this, this),
              others: {
                disabled: this.state.lockEarnings
              },
              onClear: () => {
                this.setState({
                  year: null
                });
              }
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col-2" }}
            label={{
              forceLabel: "Select a Month.",
              isImp: true
            }}
            selector={{
              name: "month",
              className: "select-fld",
              value: this.state.month,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.MONTHS
              },
              onChange: texthandle.bind(this, this),
              onClear: () => {
                this.setState({
                  month: null
                });
              },
              others: {
                disabled: this.state.lockEarnings
              }
            }}
          />

          <div className="col form-group" style={{ paddingLeft: 0 }}>
            <button
              style={{ marginTop: 21 }}
              className="btn btn-primary"
              onClick={getOvertimeGroups.bind(this, this)}
            >
              Load
            </button>
          </div>
        </div>
        <div className="row">
          {this.state.overtime_type === "M" ? (
            <div className="row">
              <div className="col-4">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-body">
                    <div className="row">
                      <AlagehFormGroup
                        div={{ className: "col-6 form-group" }}
                        label={{
                          forceLabel: "OT Hours",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "ot_value",
                          value: this.state.ot_value,
                          events: {
                            onChange: texthandle.bind(this, this)
                          },
                          others: {
                            type: "number"
                          }
                        }}
                      />
                      <div className="col-6">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Calc. Value"
                          }}
                        />
                        <h6>
                          {this.state.ot_calc_value === null
                            ? "* 0.00"
                            : "* " + String(this.state.ot_calc_value)}
                        </h6>
                      </div>

                      <AlagehFormGroup
                        div={{ className: "col-6 form-group" }}
                        label={{
                          forceLabel: "Week off OT",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "weekoff_value",
                          value: this.state.weekoff_value,
                          events: {
                            onChange: texthandle.bind(this, this)
                          },
                          others: {
                            type: "text"
                          }
                        }}
                      />
                      <div className="col-6">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Calc. Value"
                          }}
                        />
                        <h6>
                          {this.state.weekoff_calc_value === null
                            ? "* 0.00"
                            : "* " + String(this.state.weekoff_calc_value)}
                        </h6>
                      </div>
                      <AlagehFormGroup
                        div={{ className: "col-6 form-group" }}
                        label={{
                          forceLabel: "Holiday OT",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "holiday_value",
                          value: this.state.holiday_value,
                          events: {
                            onChange: texthandle.bind(this, this)
                          },
                          others: {
                            type: "text"
                          }
                        }}
                      />
                      <div className="col-6">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Calc. Value"
                          }}
                        />
                        <h6>
                          {this.state.holiday_calc_value === null
                            ? "* 0.00"
                            : "* " +
                              String(this.state.holiday_calc_value).toString()}
                        </h6>
                      </div>
                      <div className="col">
                        <button
                          className="btn btn-default"
                          onClick={clearOtValues.bind(this, this)}
                        >
                          Clear
                        </button>
                        <button
                          style={{ marginLeft: 5 }}
                          className="btn btn-primary"
                          onClick={CalculateAdd.bind(this, this)}
                          disabled={this.state.monthcalculateBtn}
                        >
                          Calculate & Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-8">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">
                        Overtime Management List
                      </h3>
                    </div>
                  </div>
                  <div className="portlet-body">
                    <div className="row">
                      <div
                        className="col-12"
                        id="OverTimeMgmntMonthlyGrid_Cntr"
                      >
                        <AlgaehDataGrid
                          id="OverTimeMgmntMonthlyGrid"
                          datavalidate="OverTimeMgmntMonthlyGrid"
                          columns={[
                            {
                              fieldName: "ot_value",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "OT Hours" }}
                                />
                              )
                            },
                            {
                              fieldName: "weekoff_value",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Week Off OT" }}
                                />
                              )
                            },
                            {
                              fieldName: "holiday_value",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Holiday OT" }}
                                />
                              )
                            }
                          ]}
                          keyId=""
                          dataSource={{ data: this.state.monthlyOverTime }}
                          isEditable={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{}}
                          others={{}}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {/* For Daily OverTime Content Starts Here */}
          {this.state.overtime_type === "D" ? (
            <div className="row">
              <div className="col-4">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-body">
                    <div className="row">
                      <AlgaehDateHandler
                        div={{ className: "col form-group" }}
                        label={{
                          forceLabel: "Select a Date",
                          isImp: this.state.overtime_type === "D" ? true : false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "select_date"
                        }}
                        maxDate={new Date()}
                        events={{
                          onChange: datehandle.bind(this, this)
                        }}
                        value={this.state.select_date}
                      />
                      <AlagehFormGroup
                        div={{ className: "col form-group" }}
                        label={{
                          forceLabel: "From Time",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "from_time",
                          value: this.state.from_time,
                          events: { onChange: timetexthandle.bind(this, this) },
                          others: {
                            type: "time"
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col form-group" }}
                        label={{
                          forceLabel: "To Time",
                          isImp: this.state.overtime_type === "D" ? true : false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "to_time",
                          value: this.state.to_time,
                          events: { onChange: timetexthandle.bind(this, this) },
                          others: {
                            type: "time"
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-6 form-group" }}
                        label={{
                          forceLabel: "OT Hours",
                          isImp: this.state.overtime_type === "D" ? true : false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "ot_value",
                          value: this.state.ot_value,
                          events: {
                            onChange: texthandle.bind(this, this)
                          },
                          others: {
                            type: "number",
                            disabled: true
                          }
                        }}
                      />
                      <div className="col-6">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Calc. Value"
                          }}
                        />
                        <h6>
                          {this.state.ot_calc_value === null
                            ? "* 0.00"
                            : "* " + String(this.state.ot_calc_value)}
                        </h6>
                      </div>

                      <AlagehFormGroup
                        div={{ className: "col-6 form-group" }}
                        label={{
                          forceLabel: "Week off OT",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "weekoff_value",
                          value: this.state.weekoff_value,
                          events: {
                            onChange: texthandle.bind(this, this)
                          },
                          others: {
                            type: "text",
                            disabled: true
                          }
                        }}
                      />
                      <div className="col-6">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Calc. Value"
                          }}
                        />
                        <h6>
                          {this.state.weekoff_calc_value === null
                            ? "* 0.00"
                            : "* " + String(this.state.weekoff_calc_value)}
                        </h6>
                      </div>
                      <AlagehFormGroup
                        div={{ className: "col-6 form-group" }}
                        label={{
                          forceLabel: "Holiday OT",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "holiday_value",
                          value: this.state.holiday_value,
                          events: {
                            onChange: texthandle.bind(this, this)
                          },
                          others: {
                            type: "text",
                            disabled: true
                          }
                        }}
                      />
                      <div className="col-6">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Calc. Value"
                          }}
                        />
                        <h6>
                          {this.state.holiday_calc_value === null
                            ? "* 0.00"
                            : "* " +
                              String(this.state.holiday_calc_value).toString()}
                        </h6>
                      </div>
                      <div className="col">
                        <button
                          className="btn btn-default"
                          onClick={clearOtValues.bind(this, this)}
                        >
                          Clear
                        </button>
                        <button
                          style={{ marginLeft: 5 }}
                          className="btn btn-primary"
                          onClick={CalculateAdd.bind(this, this)}
                          disabled={this.state.monthcalculateBtn}
                        >
                          Calculate & Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-8">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">
                        Overtime Management List
                      </h3>
                    </div>
                  </div>
                  <div className="portlet-body">
                    <div className="row">
                      <div className="col-12" id="OverTimeMgmntDailyGrid_Cntr">
                        <AlgaehDataGrid
                          id="OverTimeMgmntDailyGrid"
                          datavalidate="OverTimeMgmntDailyGrid"
                          columns={[
                            {
                              fieldName: "select_date",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Selected Date" }}
                                />
                              ),

                              displayTemplate: row => {
                                return (
                                  <span>
                                    {DisplayDateFormat(
                                      this,
                                      this,
                                      row.select_date
                                    )}
                                  </span>
                                );
                              }
                            },
                            {
                              fieldName: "from_time",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "From Time" }}
                                />
                              )
                            },
                            {
                              fieldName: "to_time",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "To Time" }}
                                />
                              )
                            },
                            {
                              fieldName: "ot_value",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "OT Hours" }}
                                />
                              )
                            },
                            {
                              fieldName: "weekoff_value",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Week Off OT" }}
                                />
                              )
                            },
                            {
                              fieldName: "holiday_value",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Holiday OT" }}
                                />
                              )
                            }
                          ]}
                          keyId=""
                          dataSource={{ data: this.state.monthlyOverTime }}
                          isEditable={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{}}
                          others={{}}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* For Daily OverTime Content End Here*/}
          <div className="col-12" style={{ marginBottom: 40 }}>
            <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
              <div className="portlet-body">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col form-group" }}
                    label={{ forceLabel: "Leave Type", isImp: false }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />

                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Comp. Off Leave"
                      }}
                    />
                    <h6>0.00</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Total OT Hours"
                      }}
                    />
                    <h6>
                      {this.state.total_hours === null
                        ? "0 Hours"
                        : this.state.total_hours + " Hours"}
                    </h6>
                  </div>

                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Total Holiday OT"
                      }}
                    />

                    <h6>
                      {this.state.total_holoday === null
                        ? "0 Hours"
                        : this.state.total_holoday + " Hours"}
                    </h6>
                  </div>

                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Total Week-Off OT"
                      }}
                    />

                    <h6>
                      {this.state.total_weeloff === null
                        ? "0 Hours"
                        : this.state.total_weeloff + " Hours"}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button type="button" className="btn btn-primary">
                <AlgaehLabel label={{ forceLabel: "Save", returnText: true }} />
              </button>
              <button type="button" className="btn btn-default">
                <AlgaehLabel
                  label={{ forceLabel: "Clear", returnText: true }}
                />
              </button>
              <button type="button" className="btn btn-other">
                <AlgaehLabel
                  label={{ forceLabel: "Print", returnText: true }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OvertimeManagement;
