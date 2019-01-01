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
      <div className="monthly_attendance">
        <div className="row inner-top-search">
          <AlgaehDateHandler
            div={{ className: "col" }}
            label={{ forceLabel: "Seletc a Month & Year", isImp: false }}
            textBox={{
              className: "txt-fld",
              name: ""
            }}
            maxDate={new Date()}
            events={{}}
          />
          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{ forceLabel: "Select a Employee", isImp: false }}
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

        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15 margin-top-15">
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
                    className="progress-bar"
                    role="progressbar"
                    aria-valuenow="75"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{ width: "75%" }}
                  />
                </div>
              </div>
              <div className="col-auto">08.45 Hrs</div>
            </div>
            <div className="row dailyTimeProgress">
              <div className="col-auto">Tue, 01</div>
              <div className="col">
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-striped bg-success progress-bar-animated"
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
              <div className="col-auto">Wed, 02</div>
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
                    role="progressbar "
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
