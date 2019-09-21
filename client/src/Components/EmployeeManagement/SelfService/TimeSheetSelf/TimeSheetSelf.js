import React, { Component } from "react";
import "./TimeSheetSelf.scss";
// import {
//   AlgaehDateHandler,
//   AlagehAutoComplete
// } from "../../../Wrapper/algaehWrapper";

export default class TimeSheetSelf extends Component {
  render() {
    return (
      <div className="monthly_attendance">
        <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption" />
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
              <div className="col-auto">Sun, 30</div>
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
              <div className="col-auto">00.00 Hrs</div>
            </div>
            <div className="row dailyTimeProgress">
              <div className="col-auto">Mon, 31</div>
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
              <div className="col-auto">08.45 Hrs</div>
            </div>
            <div className="row dailyTimeProgress">
              <div className="col-auto">Tue, 01</div>
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
              <div className="col-auto">08.45 Hrs</div>
            </div>
            <div className="row dailyTimeProgress">
              <div className="col-auto">Wed, 02</div>
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
              <div className="col-auto">05.15 Hrs</div>
            </div>
            <div className="row dailyTimeProgress">
              <div className="col-auto">Thu, 03</div>
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
              <div className="col-auto">00.00 Hrs</div>
            </div>
            <div className="row dailyTimeProgress">
              <div className="col-auto">Fri, 04</div>
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
              <div className="col-auto">00.00 Hrs</div>
            </div>
            <div className="row dailyTimeProgress">
              <div className="col-auto">Sat, 05</div>
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
              <div className="col-auto">00.00 Hrs</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
