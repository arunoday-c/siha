import React, { Component } from "react";
import "./AttendanceSettings.css";

import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";

export default class AttendanceSettings extends Component {
  render() {
    return (
      <div className="row TransactionAttendanceScreen">
        <div className="col-12">
          <div className="portlet portlet-bordered  transactionSettings">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Transaction Settings</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-2 form-group" }}
                  label={{ forceLabel: "Salary Starts from", isImp: false }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    dataSource: {},
                    others: {}
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-2 form-group" }}
                  label={{ forceLabel: "Process Leaves", isImp: false }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    dataSource: {},
                    others: {}
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-2 form-group" }}
                  label={{ forceLabel: "Salary Process Date", isImp: false }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    dataSource: {},
                    others: {}
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-2 form-group" }}
                  label={{ forceLabel: "Payroll Payment Date", isImp: false }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    dataSource: {},
                    others: {}
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-2 form-group" }}
                  label={{ forceLabel: "Salary Calc. based on", isImp: false }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    dataSource: {},
                    others: {}
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-2 form-group" }}
                  label={{
                    forceLabel: "Salary hourly calc. factor",
                    isImp: false
                  }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    dataSource: {},
                    others: {}
                  }}
                />

                <div className="col-4">
                  <label>Salary Calculation with</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input type="radio" />
                      <span>Periodical</span>
                    </label>

                    <label className="radio inline">
                      <input type="radio" />
                      <span>Fixed</span>
                    </label>
                  </div>
                  <div className="row">
                    <AlagehAutoComplete
                      div={{ className: "col form-group" }}
                      label={{ forceLabel: "Select Date", isImp: false }}
                      selector={{
                        name: "",
                        className: "select-fld",
                        dataSource: {},
                        others: {}
                      }}
                    />
                  </div>
                </div>

                <div className="col-4">
                  <label>Salary Calculation with</label>
                  <div className="customCheckbox">
                    <label className="checkbox inline">
                      <input type="checkbox" />
                      <span>Pay salary before processing </span>
                    </label>
                  </div>
                </div>

                <div className="col-4">
                  <label>Salary Calculation with</label>
                  <div className="customCheckbox">
                    <label className="checkbox inline">
                      <input type="checkbox" />
                      <span>Validate Dept. wise </span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-3 form-group" }}
                  label={{
                    forceLabel: "Leave Authorization level",
                    isImp: false
                  }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    dataSource: {},
                    others: {}
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-3 form-group" }}
                  label={{
                    forceLabel: "Loan Authorization level",
                    isImp: false
                  }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    dataSource: {},
                    others: {}
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-3 form-group" }}
                  label={{
                    forceLabel: "Review Authorization level",
                    isImp: false
                  }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    dataSource: {},
                    others: {}
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-3 form-group" }}
                  label={{ forceLabel: "Leave encashment level", isImp: false }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    dataSource: {},
                    others: {}
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-3 form-group" }}
                  label={{ forceLabel: "Advance deduction", isImp: false }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    dataSource: {},
                    others: {}
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-3 form-group" }}
                  label={{
                    forceLabel: "Appraisal Process through",
                    isImp: false
                  }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    dataSource: {},
                    others: {}
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-3 form-group" }}
                  label={{
                    forceLabel: "Leave Encashment Process",
                    isImp: false
                  }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    dataSource: {},
                    others: {}
                  }}
                />
              </div>
            </div>
          </div>

          <div className="portlet portlet-bordered attendanceSettings">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Attendance Settings</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-8">
                  <div className="row">
                    <AlagehAutoComplete
                      div={{ className: "col-4 form-group" }}
                      label={{
                        forceLabel: "Type of Attendance",
                        isImp: false
                      }}
                      selector={{
                        name: "",
                        className: "select-fld",
                        dataSource: {},
                        others: {}
                      }}
                    />

                    <div className="col-8">
                      <label>Fetch machine data for reporting purpose</label>
                      <div className="customCheckbox">
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            value="yes"
                            name="fetchMachineData"
                          />
                          <span>Yes</span>
                        </label>
                      </div>
                    </div>

                    <AlagehAutoComplete
                      div={{ className: "col form-group" }}
                      label={{ forceLabel: "Type of Overtime", isImp: false }}
                      selector={{
                        name: "",
                        className: "select-fld",
                        dataSource: {},
                        others: {}
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col form-group" }}
                      label={{
                        forceLabel: "Overtime Calculation",
                        isImp: false
                      }}
                      selector={{
                        name: "",
                        className: "select-fld",
                        dataSource: {},
                        others: {}
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col form-group" }}
                      label={{
                        forceLabel: "Overtime Payment",
                        isImp: false
                      }}
                      selector={{
                        name: "",
                        className: "select-fld",
                        dataSource: {},
                        others: {}
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col form-group" }}
                      label={{
                        forceLabel: "Daily OT Calc Type",
                        isImp: false
                      }}
                      selector={{
                        name: "",
                        className: "select-fld",
                        dataSource: {},
                        others: {}
                      }}
                    />
                  </div>
                  <div
                    className="col-12 algaehLabelFormGroup margin-top-15"
                    style={{ marginBottom: 25 }}
                  >
                    <label className="algaehLabelGroup">
                      Standard Time off
                    </label>
                    <div className="row">
                      <AlagehFormGroup
                        div={{ className: "col-3 form-group" }}
                        label={{
                          forceLabel: "In-Time",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          others: {
                            type: "time"
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-3 form-group" }}
                        label={{
                          forceLabel: "Out-Time",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          others: {
                            type: "time"
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-3 form-group" }}
                        label={{
                          forceLabel: "Number of working hr/day",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          others: {
                            type: "number"
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-3 form-group" }}
                        label={{
                          forceLabel: "Number of break hr/day",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          others: {
                            type: "number"
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <label>Apply late rules</label>
                      <div className="customCheckbox">
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            value="yes"
                            name="fetchMachineData"
                          />
                          <span>Yes</span>
                        </label>
                      </div>
                    </div>
                    <div className="col-12" id="LateTimeRules_Cntr">
                      <AlgaehDataGrid
                        id="LateTimeRules"
                        datavalidate="LateTimeRules"
                        columns={[
                          {
                            fieldName: "Column_1",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Column 1" }} />
                            )
                          },
                          {
                            fieldName: "Column_2",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Column 2" }} />
                            )
                          }
                        ]}
                        keyId=""
                        dataSource={{ data: [] }}
                        isEditable={true}
                        paging={{ page: 0, rowsPerPage: 10 }}
                        events={{}}
                        others={{}}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div
                    className="col-12 algaehLabelFormGroup margin-top-15"
                    style={{ marginBottom: 25 }}
                  >
                    <label className="algaehLabelGroup">
                      Bio Metric Database Setup
                    </label>
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-12 form-group" }}
                        label={{ forceLabel: "Database Type", isImp: false }}
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          others: {}
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-12 form-group" }}
                        label={{
                          forceLabel: "Server Name",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          others: {
                            type: "text"
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-12 form-group" }}
                        label={{
                          forceLabel: "Login ID",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          others: {
                            type: "text"
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-12 form-group" }}
                        label={{
                          forceLabel: "Password",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          others: {
                            type: "password"
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-12 form-group" }}
                        label={{
                          forceLabel: "Database",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          others: {
                            type: "text"
                          }
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-12 form-group" }}
                        label={{ forceLabel: "Swipe card type", isImp: false }}
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          others: {}
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hptl-phase1-footer">
            <div className="row">
              <div className="col-lg-12">
                <button
                  type="button"
                  className="btn btn-primary"
                  //   onClick={SaveDoctorCommission.bind(this, this)}
                  //disabled={this.state.saveEnable}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Save", returnText: true }}
                  />
                </button>

                <button
                  type="button"
                  className="btn btn-default"
                  //onClick={ClearData.bind(this, this)}
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
    );
  }
}
