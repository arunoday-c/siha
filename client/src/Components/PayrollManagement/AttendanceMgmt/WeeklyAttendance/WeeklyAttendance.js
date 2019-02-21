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
    this.state = {
      attendance_type: "D",
      year: moment().year(),
      month: moment(new Date()).format("M"),
      week: 0,
      weeks: [],
      time_sheet: [],
      weekly_time_sheet: [],
      hims_d_employee_id: "ALL",
      from_date: moment(new Date())
        .subtract(1, "days")
        .format("YYYY-MM-DD"),
      to_date: moment(new Date())
        .subtract(1, "days")
        .format("YYYY-MM-DD")
    };
  }

  componentDidMount() {
    this.getWeeks();
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

  getDailyTimeSheet() {
    let _fromDate =
      this.state.attendance_type === "M"
        ? moment(this.state.year + "-" + this.state.month)
            .startOf("month")
            .format("YYYY-MM-DD")
        : this.state.from_date;
    let _toDate =
      this.state.attendance_type === "M"
        ? moment(this.state.year + "-" + this.state.month)
            .endOf("month")
            .format("YYYY-MM-DD")
        : this.state.to_date;

    algaehApiCall({
      // uri: "/holiday/getTimeSheet",
      uri: "/holiday/getDailyTimeSheet",
      method: "GET",
      data: {
        from_date: _fromDate,
        to_date: _toDate,
        biometric_id: this.state.biometric_id
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            time_sheet: res.data.records,
            weekly_time_sheet: _.chunk(res.data.records, 7)
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

  postTimeSheet() {
    algaehApiCall({
      uri: "/holiday/postTimeSheet",
      method: "GET",
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
        hims_d_employee_id: "ALL",
        employee_name: null,
        biometric_id: null,
        year: moment().year(),
        month: moment(new Date()).format("M"),
        weeks: [],
        week: 0
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
                  value="D"
                  name="attendance_type"
                  checked={this.state.attendance_type === "D"}
                  onChange={this.textHandler.bind(this)}
                />
                <span>Date Range</span>
              </label>

              <label className="radio inline">
                <input
                  type="radio"
                  value="M"
                  name="attendance_type"
                  checked={this.state.attendance_type === "M"}
                  onChange={this.textHandler.bind(this)}
                />
                <span>Monthly</span>
              </label>
            </div>
          </div>

          {this.state.attendance_type === "M" ? (
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
              Load
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
            style={{ height: 60, borderBottom: " 1px solid #e2e2e2" }}
          >
            <div className="caption">
              <label className="label">Selected Employee</label>
              <br />
              {this.state.employee_name ? this.state.employee_name : "All"}
            </div>
            <div className="actions">
              {/*             
              <div className="weekdaysDiv">
                <i className="fas fa-arrow-circle-left" />
                <span>
                  <b>30-Dec-2019</b> - <b>5-Jan-2019</b>
                </span>
                <i className="fas fa-arrow-circle-right" />
              </div>
           */}
              <AlagehAutoComplete
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
              />
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
                    <div className="col-1">{data.employee_name}</div>
                    <div className="col-1">
                      {data.worked_hours ? data.worked_hours : "00:00"} Hrs
                    </div>

                    <div className="col-9 dayTypeCntr">
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
                              Shortage Time
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
                          className="progress-bar  bg-success"
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
          <div className="row">
            <div className="col-2" />
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
                type="button"
                className="btn btn-primary"
                onClick={this.postTimeSheet.bind(this)}
              >
                <AlgaehLabel
                  label={{ forceLabel: "Process", returnText: true }}
                />
              </button>

              <button type="button" className="btn btn-primary">
                <AlgaehLabel
                  label={{ forceLabel: "Verify", returnText: true }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
