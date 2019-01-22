import React, { Component } from "react";
import "./AttendanceSettings.css";
import { getDays } from "../../../../utils/GlobalFunctions";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import {
  AUTH_LEVEL2,
  AUTH_LEVEL3,
  ADV_DEDUCTION,
  EOS_CALC
} from "../../../../utils/GlobalVariables.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";

export default class AttendanceSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getOptions();
  }

  getOptions() {
    algaehApiCall({
      uri: "/payrollOptions/getHrmsOptions",
      method: "GET",
      module: "hrManagement",
      onSuccess: res => {
        if (res.data.success) {
          this.setState(res.data.result[0], () => {
            //  console.log("State:", this.state);
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  saveOptions() {
    algaehApiCall({
      uri: "/payrollOptions/updateHrmsOptions",
      method: "PUT",
      module: "hrManagement",
      data: this.state,
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Updated Successfully",
            type: "success"
          });
          this.getOptions();
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  textHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    let allDays = getDays();

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
                  label={{ forceLabel: "Salary Process Date", isImp: true }}
                  selector={{
                    name: "salary_process_date",
                    value: this.state.salary_process_date,
                    className: "select-fld",
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: allDays
                    },
                    onChange: this.dropDownHandler.bind(this)
                  }}
                />

                <div className="col-2">
                  <label>Pay salary before processing</label>
                  <div className="customCheckbox">
                    <label className="checkbox inline">
                      <input type="checkbox" />
                      <span>Yes</span>
                    </label>
                  </div>
                </div>

                <AlagehAutoComplete
                  div={{ className: "col-2 form-group" }}
                  label={{ forceLabel: "Payroll Payment Date", isImp: false }}
                  selector={{
                    name: "payroll_payment_date",
                    value: this.state.payroll_payment_date,
                    className: "select-fld",
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: allDays
                    },
                    onChange: this.dropDownHandler.bind(this),
                    onClear: () => {
                      this.setState({
                        payroll_payment_date: null
                      });
                    }
                  }}
                />

                <div className="col-2">
                  <label>Salary Calendar</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="P"
                        name="salary_calendar"
                        checked={this.state.salary_calendar === "P"}
                        onChange={this.textHandler.bind(this)}
                        type="radio"
                      />
                      <span>Periodical</span>
                    </label>

                    <label className="radio inline">
                      <input
                        type="radio"
                        value="F"
                        name="salary_calendar"
                        checked={this.state.salary_calendar === "F"}
                        onChange={this.textHandler.bind(this)}
                        type="radio"
                      />
                      <span>Fixed</span>
                    </label>
                  </div>
                </div>

                {this.state.salary_calendar === "F" ? (
                  <AlagehAutoComplete
                    div={{ className: "col-2 form-group" }}
                    label={{ forceLabel: "Days", isImp: true }}
                    selector={{
                      name: "salary_calendar_fixed_days",
                      value: this.state.salary_calendar_fixed_days,
                      className: "select-fld",
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: allDays
                      },
                      onChange: this.dropDownHandler.bind(this),
                      onClear: () => {
                        this.setState({
                          salary_calendar_fixed_days: null
                        });
                      }
                    }}
                  />
                ) : null}

                <div className="col-2">
                  <label>Gratuity in Final Settlement</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="Y"
                        name="gratuity_in_final_settle"
                        checked={this.state.gratuity_in_final_settle === "Y"}
                        onChange={this.textHandler.bind(this)}
                        type="radio"
                      />
                      <span>Yes</span>
                    </label>

                    <label className="radio inline">
                      <input
                        type="radio"
                        value="N"
                        name="gratuity_in_final_settle"
                        checked={this.state.gratuity_in_final_settle === "N"}
                        onChange={this.textHandler.bind(this)}
                        type="radio"
                      />
                      <span>No</span>
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
                    name: "leave_level",
                    value: this.state.leave_level,
                    className: "select-fld",
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: AUTH_LEVEL3
                    },
                    onChange: this.dropDownHandler.bind(this),
                    onClear: () => {
                      this.setState({
                        leave_level: null
                      });
                    }
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-3 form-group" }}
                  label={{
                    forceLabel: "Loan Authorization level",
                    isImp: false
                  }}
                  selector={{
                    name: "loan_level",
                    value: this.state.loan_level,
                    className: "select-fld",
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: AUTH_LEVEL2
                    },
                    onChange: this.dropDownHandler.bind(this),
                    onClear: () => {
                      this.setState({
                        loan_level: null
                      });
                    }
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-3 form-group" }}
                  label={{
                    forceLabel: "Review Authorization level",
                    isImp: false
                  }}
                  selector={{
                    name: "review_auth_level",
                    value: this.state.review_auth_level,
                    className: "select-fld",
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: AUTH_LEVEL3
                    },
                    onChange: this.dropDownHandler.bind(this),
                    onClear: () => {
                      this.setState({
                        review_auth_level: null
                      });
                    }
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-3 form-group" }}
                  label={{ forceLabel: "Leave encashment level", isImp: false }}
                  selector={{
                    name: "leave_encash_level",
                    value: this.state.leave_encash_level,
                    className: "select-fld",
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: AUTH_LEVEL2
                    },
                    onChange: this.dropDownHandler.bind(this),
                    onClear: () => {
                      this.setState({
                        leave_encash_level: null
                      });
                    }
                  }}
                />

                <div className="col-2">
                  <label>Advance deduction</label>
                  <div className="customCheckbox">
                    <label className="checkbox inline">
                      <input type="checkbox" />
                      <span>Use roundoff</span>
                    </label>
                  </div>
                  <div className="row">
                    <AlagehAutoComplete
                      div={{ className: "col form-group" }}
                      //  label={{ forceLabel: "Advance deduction", isImp: false }}
                      selector={{
                        name: "advance_deduction",
                        value: this.state.advance_deduction,
                        className: "select-fld",
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: ADV_DEDUCTION
                        },
                        onChange: this.dropDownHandler.bind(this),
                        onClear: () => {
                          this.setState({
                            advance_deduction: null
                          });
                        }
                      }}
                    />
                  </div>
                </div>

                <AlagehAutoComplete
                  div={{ className: "col-3 form-group" }}
                  label={{
                    forceLabel: "End of Service Calculation",
                    isImp: false
                  }}
                  selector={{
                    name: "end_of_service_calculation",
                    value: this.state.end_of_service_calculation,
                    className: "select-fld",
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: EOS_CALC
                    },
                    onChange: this.dropDownHandler.bind(this),
                    onClear: () => {
                      this.setState({
                        end_of_service_calculation: null
                      });
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-2 form-group" }}
                  label={{
                    forceLabel: "Yearly Working Days",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "yearly_working_days",
                    value: this.state.yearly_working_days,
                    events: {
                      onChange: this.textHandler.bind(this)
                    },
                    others: {
                      type: "number"
                    }
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
                  onClick={this.saveOptions.bind(this)}
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
