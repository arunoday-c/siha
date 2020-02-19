import React, { Component } from "react";
import "./AttendanceSettings.scss";
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
  OT_TYPE,
  ATTENDANCE_TYPE,
  OT_PAYMENTS,
  OT_HOUR_CALC,
  OT_CALC,
  BIOMETRIC_DBS,
  SWIPE_CARD_TYPE,
  MANUAL_TIME_TYPE,
  ATTN_START_TYPE
} from "../../../../utils/GlobalVariables.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";

export default class AttendanceSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      earnings: [],
      authorization_plan: "R",
      hims_d_hrms_options_id: null,
      ot_calculation: "P"
    };
    this.getOptions();
    this.getEarnings();
  }

  getEarnings() {
    algaehApiCall({
      uri: "/payrollSettings/getMiscEarningDeductions",
      module: "hrManagement",
      method: "GET",
      data: {
        component_category: "E"
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            earnings: res.data.records
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

  getOptions() {
    algaehApiCall({
      uri: "/payrollOptions/getHrmsOptions",
      method: "GET",
      module: "hrManagement",
      onSuccess: res => {
        if (res.data.success) {
          this.setState(res.data.result[0]);
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

  validateData = () => {
    const { attendance_starts, at_end_date, at_st_date } = this.state;
    if (attendance_starts === "PM") {
      if (!at_end_date || !at_st_date) {
        swalMessage({
          title: "Please enter valid Start and End date for Attendence",
          type: "error"
        });
        return false;
      } else {
        return true;
      }
    } else if (!attendance_starts) {
      swalMessage({
        title: "Please select attendence start",
        type: "error"
      });
      return false;
    } else {
      return true;
    }
  };

  saveOptions() {
    const isValid = this.validateData();
    if (isValid) {
      if (this.state.hims_d_hrms_options_id === null) {
        algaehApiCall({
          uri: "/payrollOptions/insertHrmsOptions",
          method: "POST",
          module: "hrManagement",
          data: this.state,
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Saved Successfully",
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
      } else {
        algaehApiCall({
          uri: "/payrollOptions/updateHrmsOptions",
          method: "PUT",
          module: "hrManagement",
          data: this.state,
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Saved Successfully",
                type: "success"
              });
              // this.getOptions();
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
    }
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  attnDropdownHandler(option) {
    if (option.value !== "PM") {
      this.setState({
        [option.name]: option.value,
        at_st_date: null,
        at_end_date: null
      });
    } else {
      this.dropDownHandler(option);
    }
  }

  textHandler(e) {
    switch (e.target.name) {
      case "salary_calendar":
        e.target.value === "P"
          ? this.setState({
              [e.target.name]: e.target.value,
              salary_calendar_fixed_days: null
            })
          : this.setState({
              [e.target.name]: e.target.value
            });
        break;

      case "airfare_factor":
        e.target.value === "FI"
          ? this.setState({
              [e.target.name]: e.target.value,
              airfare_percentage: null
            })
          : this.setState({
              [e.target.name]: e.target.value
            });

        break;

      default:
        this.setState({
          [e.target.name]: e.target.value
        });
        break;
    }
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
                {/* <AlagehAutoComplete
                  div={{ className: "col-2 form-group" }}
                  label={{ forceLabel: "Salary Process Date", isImp: true }}
                  selector={{
                    sort: "off",
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
                /> */}

                <div className="col-2">
                  <label>Pay salary before processing</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="Y"
                        name="salary_pay_before_end_date"
                        checked={this.state.salary_pay_before_end_date === "Y"}
                        onChange={this.textHandler.bind(this)}
                      />
                      <span>Yes</span>
                    </label>

                    <label className="radio inline">
                      <input
                        type="radio"
                        value="N"
                        name="salary_pay_before_end_date"
                        checked={this.state.salary_pay_before_end_date === "N"}
                        onChange={this.textHandler.bind(this)}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                <AlagehAutoComplete
                  div={{ className: "col-2 form-group" }}
                  label={{ forceLabel: "Payroll Payment Date", isImp: false }}
                  selector={{
                    sort: "off",
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
                      sort: "off",
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

                <AlagehAutoComplete
                  div={{ className: "col-2 form-group" }}
                  label={{ forceLabel: "Basic Earning Component", isImp: true }}
                  selector={{
                    name: "basic_earning_component",
                    value: this.state.basic_earning_component,
                    className: "select-fld",
                    dataSource: {
                      textField: "earning_deduction_description",
                      valueField: "hims_d_earning_deduction_id",
                      data: this.state.earnings
                    },
                    onChange: this.dropDownHandler.bind(this),
                    onClear: () => {
                      this.setState({
                        basic_earning_component: null
                      });
                    }
                  }}
                />
              </div>

              <div className="row">
                <div className="col-2">
                  <label>Authorization Plan</label>
                  <div className="customRadio">
                    <label className="radio block">
                      <input
                        type="radio"
                        value="R"
                        name="authorization_plan"
                        checked={this.state.authorization_plan === "R"}
                        onChange={this.textHandler.bind(this)}
                      />
                      <span>Role Wise</span>
                    </label>

                    <label className="radio block">
                      <input
                        type="radio"
                        value="A"
                        name="authorization_plan"
                        checked={this.state.authorization_plan === "A"}
                        onChange={this.textHandler.bind(this)}
                      />
                      <span>Authorization Setup</span>
                    </label>
                  </div>
                </div>
                <AlagehAutoComplete
                  div={{ className: "col-2 form-group" }}
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
                  div={{ className: "col-2 form-group" }}
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
                  div={{ className: "col-2 form-group" }}
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
                  div={{ className: "col-2 form-group" }}
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

                <AlagehAutoComplete
                  div={{ className: "col-2 form-group" }}
                  label={{ forceLabel: "Advance deduction", isImp: false }}
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

                <AlagehAutoComplete
                  div={{ className: "col-2 form-group" }}
                  label={{ forceLabel: "Attendence Starts", isImp: true }}
                  selector={{
                    name: "attendance_starts",
                    value: this.state.attendance_starts,
                    className: "select-fld",
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: ATTN_START_TYPE
                    },
                    onChange: this.attnDropdownHandler.bind(this),
                    onClear: () => {
                      this.setState({
                        attendance_starts: null,
                        at_st_date: null,
                        at_end_date: null
                      });
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-2 form-group" }}
                  label={{
                    forceLabel: "Attn. Start Date",
                    isImp: this.state.attendance_starts === "PM"
                  }}
                  selector={{
                    sort: "off",
                    name: "at_st_date",
                    value: this.state.at_st_date,
                    others: {
                      disabled: this.state.attendance_starts !== "PM"
                    },
                    className: "select-fld",
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: allDays
                    },
                    onChange: this.dropDownHandler.bind(this),
                    onClear: () => {
                      this.setState({
                        at_st_date: null
                      });
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-2 form-group" }}
                  label={{
                    forceLabel: "Attn. End Date",
                    isImp: this.state.attendance_starts === "PM"
                  }}
                  selector={{
                    sort: "off",
                    name: "at_end_date",
                    value: this.state.at_end_date,
                    others: {
                      disabled: this.state.attendance_starts !== "PM"
                    },
                    className: "select-fld",
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: allDays
                    },
                    onChange: this.dropDownHandler.bind(this),
                    onClear: () => {
                      this.setState({
                        at_end_date: null
                      });
                    }
                  }}
                />
                <div className="col">
                  <label>OT Calculation</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="P"
                        name="ot_calculation"
                        checked={this.state.ot_calculation === "P"}
                        onChange={this.textHandler.bind(this)}
                      />
                      <span>Periodical</span>
                    </label>

                    <label className="radio inline">
                      <input
                        type="radio"
                        value="F"
                        name="ot_calculation"
                        checked={this.state.ot_calculation === "F"}
                        onChange={this.textHandler.bind(this)}
                      />
                      <span>Fixed</span>
                    </label>
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="A"
                        name="ot_calculation"
                        checked={this.state.ot_calculation === "A"}
                        onChange={this.textHandler.bind(this)}
                      />
                      <span>Annual</span>
                    </label>
                  </div>
                </div>
                <div className="col">
                  <label>External Finance</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="Y"
                        name="external_finance"
                        checked={this.state.external_finance === "Y"}
                        onChange={this.textHandler.bind(this)}
                      />
                      <span>Yes</span>
                    </label>

                    <label className="radio inline">
                      <input
                        type="radio"
                        value="N"
                        name="external_finance"
                        checked={this.state.external_finance === "N"}
                        onChange={this.textHandler.bind(this)}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
                {/*
                <div className="col-2">
                  <label>Allow Round Off</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="Y"
                        name="allow_round_off"
                        checked={this.state.allow_round_off === "Y"}
                        onChange={this.textHandler.bind(this)}
                        type="radio"
                      />
                      <span>Yes</span>
                    </label>

                    <label className="radio inline">
                      <input
                        type="radio"
                        value="N"
                        name="allow_round_off"
                        checked={this.state.allow_round_off === "N"}
                        onChange={this.textHandler.bind(this)}
                        type="radio"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              */}
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
                        name: "attendance_type",
                        value: this.state.attendance_type,
                        className: "select-fld",
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: ATTENDANCE_TYPE
                        },
                        onChange: this.dropDownHandler.bind(this),
                        onClear: () => {
                          this.setState({
                            attendance_type: null
                          });
                        }
                      }}
                    />

                    <div className="col-4">
                      <label>Fetch machine data for reporting purpose</label>
                      <div className="customRadio">
                        <label className="radio inline">
                          <input
                            type="radio"
                            value="Y"
                            name="fetch_punch_data_reporting"
                            checked={
                              this.state.fetch_punch_data_reporting === "Y"
                            }
                            onChange={this.textHandler.bind(this)}
                          />
                          <span>Yes</span>
                        </label>
                        <label className="radio inline">
                          <input
                            type="radio"
                            value="N"
                            checked={
                              this.state.fetch_punch_data_reporting === "N"
                            }
                            onChange={this.textHandler.bind(this)}
                            name="fetch_punch_data_reporting"
                          />
                          <span>No</span>
                        </label>
                      </div>
                    </div>

                    <AlagehAutoComplete
                      div={{ className: "col-4 form-group" }}
                      label={{
                        forceLabel: "Manual Timesheet Entry",
                        isImp: false
                      }}
                      selector={{
                        name: "manual_timesheet_entry",
                        value: this.state.manual_timesheet_entry,
                        className: "select-fld",
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: MANUAL_TIME_TYPE
                        },
                        onChange: this.dropDownHandler.bind(this),
                        onClear: () => {
                          this.setState({
                            manual_timesheet_entry: null
                          });
                        }
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-3 form-group" }}
                      label={{
                        forceLabel: "Overtime Type",
                        isImp: false
                      }}
                      selector={{
                        name: "overtime_type",
                        value: this.state.overtime_type,
                        className: "select-fld",
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: OT_TYPE
                        },
                        onChange: this.dropDownHandler.bind(this),
                        onClear: () => {
                          this.setState({
                            overtime_type: null
                          });
                        }
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col form-group" }}
                      label={{
                        forceLabel: "Overtime Calculation",
                        isImp: false
                      }}
                      selector={{
                        name: "overtime_calculation",
                        value: this.state.overtime_calculation,
                        className: "select-fld",
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: OT_CALC
                        },
                        onChange: this.dropDownHandler.bind(this),
                        onClear: () => {
                          this.setState({
                            overtime_calculation: null
                          });
                        }
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col form-group" }}
                      label={{
                        forceLabel: "Overtime Payment",
                        isImp: false
                      }}
                      selector={{
                        name: "overtime_payment",
                        value: this.state.overtime_payment,
                        className: "select-fld",
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: OT_PAYMENTS
                        },
                        onChange: this.dropDownHandler.bind(this),
                        onClear: () => {
                          this.setState({
                            overtime_payment: null
                          });
                        }
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col form-group" }}
                      label={{
                        forceLabel: "Hourly OT Calc Type",
                        isImp: false
                      }}
                      selector={{
                        name: "overtime_hourly_calculation",
                        value: this.state.overtime_hourly_calculation,
                        className: "select-fld",
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: OT_HOUR_CALC
                        },
                        onChange: this.dropDownHandler.bind(this),
                        onClear: () => {
                          this.setState({
                            overtime_hourly_calculation: null
                          });
                        }
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
                          name: "standard_intime",
                          value: this.state.standard_intime,
                          events: {
                            onChange: this.textHandler.bind(this)
                          },
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
                          name: "standard_outime",
                          value: this.state.standard_outime,
                          events: {
                            onChange: this.textHandler.bind(this)
                          },
                          others: {
                            type: "time"
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
                          name: "standard_break_hours",
                          value: this.state.standard_break_hours,
                          events: {
                            onChange: this.textHandler.bind(this)
                          },
                          others: {
                            type: "number"
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
                          name: "standard_working_hours",
                          value: this.state.standard_working_hours,
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
                          name: "biometric_database",
                          value: this.state.biometric_database,
                          className: "select-fld",
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: BIOMETRIC_DBS
                          },
                          onChange: this.dropDownHandler.bind(this),
                          onClear: () => {
                            this.setState({
                              biometric_database: null
                            });
                          }
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
                          name: "biometric_server_name",
                          value: this.state.biometric_server_name,
                          events: {
                            onChange: this.textHandler.bind(this)
                          },
                          others: {
                            type: "text"
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-12 form-group" }}
                        label={{
                          forceLabel: "Port Number",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "biometric_port_no",
                          value: this.state.biometric_port_no,
                          events: {
                            onChange: this.textHandler.bind(this)
                          },
                          others: {
                            type: "number"
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
                          name: "biometric_database_login",
                          value: this.state.biometric_database_login,
                          events: {
                            onChange: this.textHandler.bind(this)
                          },
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
                          name: "biometric_database_password",
                          value: this.state.biometric_database_password,
                          events: {
                            onChange: this.textHandler.bind(this)
                          },
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
                          name: "biometric_database_name",
                          value: this.state.biometric_database_name,
                          events: {
                            onChange: this.textHandler.bind(this)
                          },
                          others: {
                            type: "text"
                          }
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-12 form-group" }}
                        label={{ forceLabel: "Swipe Card Type", isImp: false }}
                        selector={{
                          name: "biometric_swipe_id",
                          value: this.state.biometric_swipe_id,
                          className: "select-fld",
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: SWIPE_CARD_TYPE
                          },
                          onChange: this.dropDownHandler.bind(this),
                          onClear: () => {
                            this.setState({
                              biometric_swipe_id: null
                            });
                          }
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
