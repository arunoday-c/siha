import React, { Component } from "react";

import "./WeeklyAttendance.css";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";
import moment from "moment";

export default class WeeklyAttendance extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="hrTimeSheet">
        <div className="row inner-top-search">
          <div className="col">
            <label>View by All Employee</label>
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
                border: " 1px solid #ced4d9",
                borderRadius: 5,
                marginLeft: 0
              }}
            >
              <div className="col">
                <AlgaehLabel label={{ forceLabel: "Employee Name" }} />
                <h6>------</h6>
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
                />
              </div>
            </div>
          </div>

          <AlagehAutoComplete
            div={{ className: "col-2 form-group" }}
            label={{ forceLabel: "Select a year", isImp: false }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              others: {}
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{ forceLabel: "Select a Month", isImp: false }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              others: {}
            }}
          />

          <div className="col form-group">
            <button style={{ marginTop: 21 }} className="btn btn-primary">
              Load
            </button>
          </div>
        </div>

        <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">Employee Name</div>
            <div className="actions">
              <div className="weekdaysDiv">
                <i className="fas fa-arrow-circle-left" />
                <span>
                  <b>30-Dec-2019</b> - <b>5-Jan-2019</b>
                </span>
                <i className="fas fa-arrow-circle-right" />
              </div>
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
            {/* dailyTimeProgress */}
            <div className="row dailyTimeProgress">
              <div className="col-3 time_name">
                Aboobacker Sidhiqe Aboobacker Sidhiqe
                <br />
                <small>EMP00001</small>
              </div>
              <div className="col-1 totalHours">00.00 Hrs</div>

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
            {/* dailyTimeProgress */}
          </div>
        </div>
      </div>
    );
  }
}
