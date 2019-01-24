import React, { Component } from "react";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import Employee from "../../../../Search/Employee.json";
import "./WeeklyAttendance.css";
import {
  AlagehAutoComplete,
  AlgaehLabel
} from "../../../Wrapper/algaehWrapper";
import moment from "moment";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { getYears } from "../../../../utils/GlobalFunctions";

export default class WeeklyAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: moment().year(),
      month: moment(new Date()).format("M"),
      weeks: []
    };
  }

  componentDidMount() {
    this.getWeeks();
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
            hims_d_employee_id: row.hims_d_employee_id
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

  render() {
    let allYears = getYears();
    return (
      <div className="hrTimeSheet">
        <div className="row inner-top-search">
          <div className="col">
            <label>View by All Employees</label>
            <div className="customCheckbox">
              <label className="checkbox inline">
                <input type="checkbox" value="yes" name="" />
                <span>Yes</span>
              </label>
            </div>
          </div>

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

          <div className="col form-group">
            <button style={{ marginTop: 21 }} className="btn btn-primary">
              Load
            </button>
          </div>
        </div>

        <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
          <div
            className="portlet-title"
            style={{ height: 60, borderBottom: " 1px solid #e2e2e2" }}
          >
            <div className="caption">Employee Name</div>
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
            <div className="row dailyTimeProgress">
              <div className="col-1">Sun, 30</div>
              <div className="col-1">00.00 Hrs</div>
              <div className="col">
                <div className="progress week-off">
                  <div
                    className="progress-bar "
                    role="progressbar"
                    aria-valuenow="100"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{ width: "100%" }}
                  >
                    <span>Week Off</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row dailyTimeProgress">
              <div className="col-1">Mon, 31</div>
              <div className="col-1">08.45 Hrs</div>
              <div className="col">
                <div className="progress">
                  <div
                    className="progress-bar  bg-danger"
                    role="progressbar"
                    aria-valuenow="75"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{ width: "45%" }}
                  >
                    <div className="tooltipDetails">
                      <span className="checkIn animated bounceIn faster">
                        Check In <b>07:55 AM</b>
                      </span>
                      <span className="totalHr animated bounceIn faster">
                        Late time by <b className="lateTime">55 min</b>
                      </span>
                      <span className="checkOut animated bounceIn faster">
                        Check Out <b>06:15 PM</b>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row dailyTimeProgress">
              <div className="col-1">Tue, 01</div>
              <div className="col-1">08.45 Hrs</div>
              <div className="col">
                <div className="progress">
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    aria-valuenow="75"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{ width: "90%" }}
                  >
                    <div className="tooltipDetails">
                      <span className="checkIn animated bounceIn faster">
                        Check In <b>08:55 AM</b>
                      </span>
                      <span className="totalHr animated bounceIn faster">
                        Over time by<b className="OverTime">20 min</b>
                      </span>
                      <span className="checkOut animated bounceIn faster">
                        Check Out <b>07:45 PM</b>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row dailyTimeProgress">
              <div className="col-1">Wed, 02</div>
              <div className="col-1">05.15 Hrs</div>
              <div className="col">
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-striped  progress-bar-animated"
                    role="progressbar"
                    aria-valuenow="75"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{ width: "55%" }}
                  />
                </div>
              </div>
            </div>
            <div className="row dailyTimeProgress">
              <div className="col-1">Thu, 03</div>
              <div className="col-1">00.00 Hrs</div>
              <div className="col">
                <div className="progress ">
                  <div
                    className="progress-bar bg-default "
                    role="progressbar"
                    aria-valuenow="75"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>
            <div className="row dailyTimeProgress">
              <div className="col-1">Fri, 04</div>
              <div className="col-1">00.00 Hrs</div>
              <div className="col">
                <div className="progress ">
                  <div
                    className="progress-bar bg-default "
                    role="progressbar "
                    aria-valuenow="75"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>
            <div className="row dailyTimeProgress">
              <div className="col-1">Sat, 05</div>
              <div className="col-1">00.00 Hrs</div>
              <div className="col">
                <div className="progress week-off">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    aria-valuenow="100"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{ width: "100%" }}
                  >
                    <span>Week Off</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="portlet-body WeeklyTimeProgress">
            {/* Start Element Daily Progress*/}
            {/*           
            <div className="row dailyTimeProgress">
              <div className="col-3 time_name">
                Aboobacker Sidhiqe
                <br />
                <small>EMP00001</small>
              </div>
              <div className="col-1 totalHours">00.00 Hrs</div>
              <div className="col">
                <div className="col">
                  <div className="progress ">
                    <div
                      className="progress-bar bg-default"
                      role="progressbar "
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
           */}
            {/* End Element Daily Progress*/}
          </div>
        </div>
      </div>
    );
  }
}
