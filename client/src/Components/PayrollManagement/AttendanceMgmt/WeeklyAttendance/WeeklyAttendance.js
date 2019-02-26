import React, { Component } from "react";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import Employee from "../../../../Search/Employee.json";
import "./WeeklyAttendance.css";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";
import moment from "moment";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { getYears } from "../../../../utils/GlobalFunctions";
import _ from "lodash";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";

export default class WeeklyAttendance extends Component {
  constructor(props) {
    super(props);
    const _yearAndMonth = moment(new Date()).format("YYYY-MM") + "01";
    let _fromDate = moment(_yearAndMonth, "YYYY-MM-DD").format("YYYY-MM-DD");
    this.state = {
      attendance_type: "MW",
      year: moment().year(),
      month: moment(new Date()).format("M"),
      week: 0,
      disableNotify: false,
      weeks: [],
      sub_depts: [],
      time_sheet: [],
      loader: false,
      hims_d_employee_id: null,
      hospital_id: JSON.parse(sessionStorage.getItem("CurrencyDetail"))
        .hims_d_hospital_id,
      from_date: _fromDate, //moment(new Date())
      // .subtract(1, "days")
      // .format("YYYY-MM-DD"),
      to_date: moment(new Date())
        .subtract(1, "days")
        .format("YYYY-MM-DD")
    };
    this.getSubDepts();
    this.getOrganization();
  }

  getOrganization() {
    algaehApiCall({
      uri: "/organization/getOrganization",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            hospitals: response.data.records
          });
        }
      },
      onFailure: error => {
        this.setState({
          branch: {
            loader: false
          }
        });
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  getSubDepts() {
    algaehApiCall({
      uri: "/department/get/subdepartment",
      module: "masterSettings",
      data: {
        sub_department_status: "A"
      },
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            sub_depts: res.data.records
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

  componentDidMount() {
    this.getWeeks();
  }

  notifyExceptions() {
    let _fromDate = this.state.from_date;
    let _toDate = this.state.to_date;

    if (this.state.attendance_type === "MW") {
      let date = this.state.year + "-" + this.state.month + "-01";

      _fromDate = moment(date)
        .startOf("month")
        .format("YYYY-MM-DD");
      _toDate = moment(date)
        .endOf("month")
        .format("YYYY-MM-DD");
    }

    algaehApiCall({
      uri: "/attendance/notifyException",
      method: "POST",
      data: {
        from_date: _fromDate,
        to_date: _toDate,
        hospital_id: this.state.hospital_id,
        hims_d_employee_id: this.state.hims_d_employee_id,
        sub_department_id: this.state.sub_department_id
      },
      module: "hrManagement",
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Notified Successfully . .",
            type: "success"
          });
          this.setState({
            disableNotify: true
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

  getTimeSheet() {
    algaehApiCall({
      uri: "/holiday/getTimeSheet",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          // this.getDailyTimeSheet();
        } else if (!res.data.success) {
          swalMessage({
            title: res.data.message,
            type: "warning"
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

  processBiometricAttendance() {
    let _fromDate =
      this.state.attendance_type === "DW"
        ? this.state.attendance_date
        : this.state.from_date;
    let _toDate =
      this.state.attendance_type === "DW"
        ? this.state.attendance_date
        : this.state.to_date;
    algaehApiCall({
      uri: "/attendance/processBiometricAttendance",
      module: "hrManagement",
      method: "GET",
      data: {
        from_date: _fromDate,
        to_date: _toDate,
        hospital_id: this.state.hospital_id,
        hims_d_employee_id: this.state.hims_d_employee_id,
        sub_department_id: this.state.sub_department_id
      },
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Verified Successfully",
            type: "success"
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

  getDailyTimeSheet() {
    if (
      this.state.attendance_type === "MW" &&
      (this.state.hims_d_employee_id === null ||
        this.state.hims_d_employee_id === undefined)
    ) {
      swalMessage({
        title: "Please select an Employee to view ",
        type: "warning"
      });
    } else if (
      moment(this.state.from_date).format("YYYYMMDD") >
      moment(this.state.to_date).format("YYYYMMDD")
    ) {
      swalMessage({
        title: "Please set a proper date range",
        type: "warning"
      });
    } else if (
      moment(this.state.to_date).format("YYYYMMDD") >
        moment(this.state.from_date).format("YYYYMMDD") &&
      (this.state.hims_d_employee_id === null ||
        this.state.hims_d_employee_id === undefined)
    ) {
      swalMessage({
        title: "Please select an Employee to view ",
        type: "warning"
      });
    } else {
      this.setState({
        loader: true
      });

      let _fromDate = this.state.from_date;
      let _toDate = this.state.to_date;

      if (this.state.attendance_type === "MW") {
        let date = this.state.year + "-" + this.state.month + "-01";

        _fromDate = moment(date)
          .startOf("month")
          .format("YYYY-MM-DD");
        _toDate = moment(date)
          .endOf("month")
          .format("YYYY-MM-DD");
      }

      algaehApiCall({
        uri: "/attendance/getDailyTimeSheet",
        method: "GET",
        module: "hrManagement",
        data: {
          from_date: _fromDate,
          to_date: _toDate,
          hospital_id: this.state.hospital_id,
          hims_d_employee_id: this.state.hims_d_employee_id,
          sub_department_id: this.state.sub_department_id
        },
        onSuccess: res => {
          if (res.data.success) {
            if (Array.isArray(res.data.result)) {
              this.setState({
                time_sheet: res.data.result,
                loader: false
              });
            } else {
              swalMessage({
                title: res.data.result.message,
                type: "warning"
              });
              this.setState({ loader: false });
            }
          } else if (!res.data.success) {
            swalMessage({
              title: res.data.result.message,
              type: "warning"
            });
            this.setState({
              loader: false
            });
          }
        },
        onFailure: err => {
          swalMessage({
            title: err.message,
            type: "error"
          });
          this.setState({
            loader: false
          });
        }
      });
    }
  }

  postTimeSheet() {
    let _fromDate =
      this.state.attendance_type === "DW"
        ? this.state.attendance_date
        : this.state.from_date;
    let _toDate =
      this.state.attendance_type === "DW"
        ? this.state.attendance_date
        : this.state.to_date;

    algaehApiCall({
      uri: "/holiday/postTimeSheet",
      method: "GET",
      data: {
        from_date: _fromDate,
        to_date: _toDate,
        hims_d_employee_id: this.state.hims_d_employee_id
      },
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Posted Successfully. . ",
            type: "success"
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

  clearState() {
    this.setState(
      {
        hims_d_employee_id: null,
        employee_name: null,
        biometric_id: null,
        attendance_date: null,
        weeks: [],
        week: 0,
        time_sheet: [],
        disableNotify: false
      },
      () => {
        this.getWeeks();
      }
    );
  }

  getWeeks() {
    let daysOfMonth = moment(
      new Date(this.state.year + "-" + this.state.month + "-01")
    ).daysInMonth();

    let weeksInMonth = Math.ceil(daysOfMonth / 7);

    let weeksData = [{ name: "All", value: 0 }];
    for (let i = 1; i <= weeksInMonth; i++) {
      weeksData.push({
        name: "Week " + i,
        value: i
      });
    }

    this.setState({
      weeks: weeksData
    });
  }

  employeeSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: Employee
      },
      inputs:
        this.state.sub_department_id !== null &&
        this.state.sub_department_id !== undefined
          ? "sub_department_id = " + this.state.sub_department_id
          : "sub_department_id > 1",
      searchName: "employee",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        this.setState(
          {
            employee_name: row.full_name,
            hims_d_employee_id: row.hims_d_employee_id,
            biometric_id: row.biometric_id
          },
          () => {}
        );
      }
    });
  }

  dropDownHandler(value) {
    switch (value.name) {
      case "month":
        this.setState(
          {
            [value.name]: value.value
          },
          () => {
            this.getWeeks();
          }
        );
        break;

      default:
        this.setState(
          {
            [value.name]: value.value
          },
          () => {
            this.getWeeks();
          }
        );
        break;
    }
  }

  textHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  changeChecks(e) {
    this.setState({
      [e.target.name]: e.target.checked ? e.target.value : null
    });
  }

  render() {
    let allYears = getYears();
    return (
      <div className="hrTimeSheet">
        <div className="row inner-top-search">
          <div className="col-2">
            <label />
            <div className="customRadio">
              <label className="radio inline">
                <input
                  type="radio"
                  value="MW"
                  name="attendance_type"
                  checked={this.state.attendance_type === "MW"}
                  onChange={this.textHandler.bind(this)}
                />
                <span>Month Wise</span>
              </label>

              <label className="radio inline">
                <input
                  type="radio"
                  value="DR"
                  name="attendance_type"
                  checked={this.state.attendance_type === "DR"}
                  onChange={this.textHandler.bind(this)}
                />
                <span>Date Range</span>
              </label>
            </div>
          </div>

          {this.state.attendance_type === "MW" ? (
            <React.Fragment>
              <AlagehAutoComplete
                div={{ className: "col" }}
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
                  onChange: this.dropDownHandler.bind(this),
                  onClear: () => {
                    this.setState({
                      year: null
                    });
                  }
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  forceLabel: "Select a Month.",
                  isImp: true
                }}
                selector={{
                  sort: "off",
                  name: "month",
                  className: "select-fld",
                  value: this.state.month,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: GlobalVariables.MONTHS
                  },
                  onChange: this.dropDownHandler.bind(this),
                  onClear: () => {
                    this.setState({
                      month: null
                    });
                  }
                }}
              />

              {/* <AlgaehDateHandler
                div={{ className: "col margin-bottom-15" }}
                label={{
                  forceLabel: "Date",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "attendance_date",
                  others: {
                    tabIndex: "1"
                  }
                }}
                events={{
                  onChange: selDate => {
                    this.setState({
                      attendance_date: selDate
                    });
                  }
                }}
                maxDate={moment(new Date()).subtract("days", 1)}
                value={this.state.attendance_date}
              /> */}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <AlgaehDateHandler
                div={{ className: "col margin-bottom-15" }}
                label={{
                  forceLabel: "From Date",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "from_date",
                  others: {
                    tabIndex: "1"
                  }
                }}
                events={{
                  onChange: selDate => {
                    this.setState({
                      from_date: selDate
                    });
                  }
                }}
                maxDate={new Date()}
                value={this.state.from_date}
              />
              <AlgaehDateHandler
                div={{ className: "col margin-bottom-15" }}
                label={{
                  forceLabel: "To Date",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "to_date",
                  others: {
                    tabIndex: "2"
                  }
                }}
                events={{
                  onChange: selDate => {
                    this.setState({
                      to_date: selDate
                    });
                  }
                }}
                minDate={this.state.from_date}
                value={this.state.to_date}
              />
            </React.Fragment>
          )}

          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{
              forceLabel: "Filter by Branch",
              isImp: true
            }}
            selector={{
              name: "hospital_id",
              className: "select-fld",
              value: this.state.hospital_id,
              dataSource: {
                textField: "hospital_name",
                valueField: "hims_d_hospital_id",
                data: this.state.hospitals
              },
              onChange: this.dropDownHandler.bind(this),
              onClear: () => {
                this.setState({
                  hospital_id: null
                });
              }
            }}
            //showLoading={this.state.branch.loader}
          />

          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{
              forceLabel: "Select a Dept..",
              isImp: false
            }}
            selector={{
              name: "sub_department_id",
              className: "select-fld",
              value: this.state.sub_department_id,
              dataSource: {
                textField: "sub_department_name",
                valueField: "hims_d_sub_department_id",
                data: this.state.sub_depts
              },
              onChange: this.dropDownHandler.bind(this),
              onClear: () => {
                this.setState({
                  sub_department_id: null
                });
              }
            }}
          />

          <div className="col" style={{ marginTop: 10 }}>
            <div
              className="row"
              style={{
                border: "1px solid #ced4d9",
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
                  onClick={this.employeeSearch.bind(this)}
                />
              </div>
            </div>
          </div>

          <div className="col form-group">
            <button
              onClick={this.getDailyTimeSheet.bind(this)}
              style={{ marginTop: 21 }}
              className="btn btn-primary"
            >
              {!this.state.loader ? (
                <span>Load</span>
              ) : (
                <i className="fas fa-spinner fa-spin" />
              )}
            </button>

            <button
              onClick={this.clearState.bind(this)}
              style={{ marginTop: 21, marginLeft: 5 }}
              className="btn btn-default"
            >
              CLEAR
            </button>
          </div>
        </div>

        <div className="portlet portlet-bordered margin-top-15">
          <div
            className="portlet-title"
            style={{ height: 45, borderBottom: " 1px solid #e2e2e2" }}
          >
            <div className="caption">
              <label className="label">Selected Employee</label>
              <br />
              {this.state.employee_name ? this.state.employee_name : "All"}
            </div>
            <div className="actions">
              <span className="legendValue bg-shortage">
                Shortage Hour<b>04.23 Hr</b>
              </span>
              <span className="legendValue bg-success">
                Excess Hour<b>16.45 Hr</b>
              </span>
              <span className="legendValue bg-default">
                Total Working Hour<b>146.00 Hr</b>
              </span>
              {/*             
              <div className="weekdaysDiv">
                <i className="fas fa-arrow-circle-left" />
                <span>
                  <b>30-Dec-2019</b> - <b>5-Jan-2019</b>
                </span>
                <i className="fas fa-arrow-circle-right" />
              </div>
           */}
              {/* <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  forceLabel: "Select Week",
                  isImp: true
                }}
                selector={{
                  name: "week",
                  className: "select-fld",
                  value: this.state.week,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: this.state.weeks
                  },
                  onChange: this.dropDownHandler.bind(this),
                  onClear: () => {
                    this.setState({
                      week: null
                    });
                  }
                }}
              /> */}
            </div>
          </div>
          <div className="portlet-body WeeklyTimeProgress">
            {this.state.time_sheet.length === 0 ? (
              <div className="noTimeSheetData">
                <h1>Employee Time Sheet</h1>
                <i className="fas fa-user-clock" />
              </div>
            ) : (
              this.state.time_sheet.map((data, index) =>
                data.status === "WO" ? (
                  <div
                    key={data.hims_f_daily_time_sheet_id}
                    className="row dailyTimeProgress weekOffCntr"
                  >
                    <div className="col-1">
                      {moment(data.attendance_date).format("ddd, Do")}
                    </div>
                    <div className="col-1">
                      {data.employee_name ? data.employee_name : "------"}
                    </div>
                    <div className="col-1">
                      {data.worked_hours ? data.worked_hours : "00:00"} Hrs
                    </div>
                    <div className="col-9 dayTypeCntr">
                      <span className="weekOffCntr">Week Off</span>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          aria-valuenow="100"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  </div>
                ) : data.status === "PR" ? (
                  <div
                    key={data.hims_f_daily_time_sheet_id}
                    className="row dailyTimeProgress"
                  >
                    <div className="col-1">
                      {moment(data.attendance_date).format("ddd, Do")}
                    </div>
                    <div className="col-1">
                      {data.employee_name ? data.employee_name : "------"}
                    </div>
                    <div className="col-1">
                      {data.worked_hours ? data.worked_hours : "00:00"} Hrs
                    </div>

                    <div className="col-9 dayTypeCntr">
                      <label className="timeCheckCntr">
                        <input type="checkbox" /> <span className="checkmark" />{" "}
                      </label>

                      <div className="tooltipDetails">
                        <span className="checkIn animated bounceIn faster">
                          <i> Check In</i>
                          <br />
                          Time:
                          <b>
                            {moment(data.in_time, "HH:mm:ss").format("hh:mm a")}
                          </b>
                          <br />
                          Date:
                          <b>
                            {moment(data.attendance_date).format("MMM Do YYYY")}
                          </b>
                        </span>
                        <span className="totalHr animated bounceIn faster">
                          {data.actual_hours - data.worked_hours > 0 ? (
                            <React.Fragment>
                              Shortage Time:
                              <b className="lateTime">
                                {Math.abs(
                                  data.actual_hours - data.worked_hours
                                ).toFixed(2)}{" "}
                                Hrs
                              </b>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              Excess Time
                              <b className="OverTime">
                                {Math.abs(
                                  data.actual_hours - data.worked_hours
                                ).toFixed(2)}{" "}
                                Hrs
                              </b>
                            </React.Fragment>
                          )}
                        </span>
                        <span className="checkOut animated bounceIn faster">
                          <i> Check Out </i>
                          <br />
                          Time:
                          <b>
                            {moment(data.out_time, "HH:mm:ss").format(
                              "hh:mm a"
                            )}
                          </b>
                          <br />
                          Date:
                          <b>{moment(data.out_date).format("MMM Do YYYY")}</b>
                        </span>
                      </div>
                      <div className="progress">
                        <div
                          className={
                            data.actual_hours - data.worked_hours > 0
                              ? "progress-bar  bg-shortage"
                              : "progress-bar  bg-success"
                          }
                          role="progressbar"
                          style={{
                            width:
                              (data.worked_hours / data.actual_hours) * 100 +
                              "%"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : data.status === "AB" ? (
                  <div
                    key={data.hims_f_daily_time_sheet_id}
                    className="row dailyTimeProgress"
                  >
                    <div className="col-1">
                      {moment(data.attendance_date).format("ddd, Do")}
                    </div>
                    <div className="col-1">
                      {data.employee_name ? data.employee_name : "------"}
                    </div>
                    <div className="col-1">
                      {data.worked_hours ? data.worked_hours : "00:00"} Hrs
                    </div>
                    <div className="col-9 dayTypeCntr">
                      <span className="absentCntr">Absent</span>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  </div>
                ) : data.status === "HO" ? (
                  <div
                    key={data.hims_f_daily_time_sheet_id}
                    className="row dailyTimeProgress "
                  >
                    <div className="col-1">
                      {moment(data.attendance_date).format("ddd, Do")}
                    </div>
                    <div className="col-1">
                      {data.employee_name ? data.employee_name : "------"}
                    </div>
                    <div className="col-1">
                      {data.worked_hours ? data.worked_hours : "00:00"} Hrs
                    </div>
                    <div className="col-9 dayTypeCntr">
                      <span className="holidayCntr">Holiday</span>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  </div>
                ) : data.status === "PL" ? (
                  <div
                    key={data.hims_f_daily_time_sheet_id}
                    className="row dailyTimeProgress"
                  >
                    <div className="col-1">
                      {moment(data.attendance_date).format("ddd, Do")}
                    </div>
                    <div className="col-1">
                      {data.employee_name ? data.employee_name : "------"}
                    </div>
                    <div className="col-1">
                      {data.worked_hours ? data.worked_hours : "00:00"} Hrs
                    </div>
                    <div className="col-9 dayTypeCntr">
                      <span className="paidLeaveCntr">Paid Leave</span>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  </div>
                ) : data.status === "EX" ? (
                  <div
                    key={data.hims_f_daily_time_sheet_id}
                    className="row dailyTimeProgress"
                  >
                    <div className="col-1">
                      {moment(data.attendance_date).format("ddd, Do")}
                    </div>
                    <div className="col-1">
                      {data.employee_name ? data.employee_name : "------"}
                    </div>
                    <div className="col-1">
                      {data.worked_hours ? data.worked_hours : "00:00"} Hrs
                    </div>
                    <div className="col-9 dayTypeCntr">
                      <div className="progress">
                        <div
                          className="progress-bar  bg-danger"
                          role="progressbar"
                          style={{
                            width: "50%"
                          }}
                        />
                      </div>
                      <div className="tooltipDetails">
                        <span className="checkIn animated bounceIn faster">
                          <i> Check In</i>
                          <br />
                          Time:
                          <b>
                            {data.in_time
                              ? moment(data.in_time, "HH:mm:ss").format(
                                  "hh:mm a"
                                )
                              : "Not Available"}
                          </b>{" "}
                          <br />
                          Date:
                          <b>
                            {data.attendance_date
                              ? moment(data.attendance_date).format(
                                  "MMM Do YYYY"
                                )
                              : "Not Available"}
                          </b>
                        </span>
                        <span className="totalHr animated bounceIn faster">
                          EXCEPTION
                        </span>
                        <span className="checkOut animated bounceIn faster">
                          <i> Check Out</i>
                          <br />
                          Time:
                          <b>
                            {data.out_time
                              ? moment(data.out_time, "HH:mm:ss").format(
                                  "hh:mm a"
                                )
                              : "Not Available"}
                          </b>
                          <br />
                          Date:
                          <b>
                            {data.out_date
                              ? moment(data.out_date).format("MMM Do YYYY")
                              : "Not Available"}
                          </b>
                        </span>
                      </div>
                    </div>
                  </div>
                ) : data.status === "UL" ? (
                  <div
                    key={data.hims_f_daily_time_sheet_id}
                    className="row dailyTimeProgress"
                  >
                    <div className="col-1">
                      {moment(data.attendance_date).format("ddd, Do")}
                    </div>
                    <div className="col-1">
                      {data.employee_name ? data.employee_name : "------"}
                    </div>
                    <div className="col-1">
                      {data.worked_hours ? data.worked_hours : "00:00"} Hrs
                    </div>
                    <div className="col-9 dayTypeCntr">
                      <span className="unPaidLeaveCntr">Unpaid Leave</span>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  </div>
                ) : null
              )
            )}
          </div>
          <div
            className="row"
            style={{
              padding: "15px"
            }}
          >
            <div className="col-3" />
            <div className="col-9">
              <div className="ruler">
                <div className="cm">
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                </div>
                <div className="cm">
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                </div>
                <div className="cm">
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                </div>
                <div className="cm">
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                </div>
                <div className="cm">
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                </div>
                <div className="cm">
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                </div>
                <div className="cm">
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                </div>
                <div className="cm">
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                </div>
                <div className="cm">
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                </div>
                <div className="cm">
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                </div>
                <div className="cm">
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                </div>
                <div className="cm">
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                  <div className="mm" />
                </div>
                <div className="cm" />
              </div>
            </div>
          </div>
        </div>

        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                disabled={this.state.time_sheet.length === 0}
                type="button"
                className="btn btn-primary"
                onClick={this.postTimeSheet.bind(this)}
              >
                <AlgaehLabel
                  label={{ forceLabel: "Process", returnText: true }}
                />
              </button>

              <button
                disabled={this.state.time_sheet.length === 0}
                onClick={this.processBiometricAttendance.bind(this)}
                type="button"
                className="btn btn-primary"
              >
                <AlgaehLabel
                  label={{ forceLabel: "Verify", returnText: true }}
                />
              </button>

              <button
                disabled={
                  this.state.disableNotify || this.state.time_sheet.length === 0
                }
                onClick={this.notifyExceptions.bind(this)}
                type="button"
                className="btn btn-danger"
              >
                <AlgaehLabel
                  label={{ forceLabel: "Notify Exceptions", returnText: true }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
