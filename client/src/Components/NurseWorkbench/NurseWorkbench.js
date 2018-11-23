import React, { Component } from "react";
import "./nurse_workbench.css";
import moment from "moment";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";
import Enumerable from "linq";

class NurseWorkbench extends Component {
  constructor(props) {
    super(props);
    let dateToday = moment().format("YYYY") + moment().format("MM") + "01";
    this.state = {
      my_daylist: [],
      selectedLang: "en",
      data: [],
      selectedHDate: moment(dateToday, "YYYYMMDD")._d,
      fromDate: moment()._d,
      toDate: moment()._d,
      activeDateHeader: moment()._d
    };
  }

  loadListofData() {}

  monthChangeHandler(e) {
    let dt = moment(e.target.value + "-01", "YYYY-MM-DD")._d;
    this.setState({ selectedHDate: dt, activeDateHeader: dt });
  }

  liGenerate() {
    let momDate = moment(this.state.selectedHDate);
    let initialDate = momDate._d;
    var date = initialDate,
      y = date.getFullYear(),
      m = date.getMonth();
    var lastDay = new Date(y, m + 1, 0);
    let endDate = moment(lastDay)._d;

    let generatedLi = [];

    while (
      moment(initialDate).format("YYYYMMDD") <=
      moment(endDate).format("YYYYMMDD")
    ) {
      let dt = moment(initialDate);

      generatedLi.push({
        day: dt.format("DD"),
        currentdate: dt._d,
        dayName: dt.format("ddd")
      });

      initialDate.setDate(initialDate.getDate() + 1);
    }
    return generatedLi;
  }
  onSelectedDateHandler(e) {
    const fromDate = e.currentTarget.getAttribute("date");
    this.setState(
      {
        activeDateHeader: e.currentTarget.getAttribute("date"),
        fromDate: e.currentTarget.getAttribute("date"),
        toDate: e.currentTarget.getAttribute("date")
      },
      () => {
        localStorage.setItem(
          "workbenchDateRange",
          JSON.stringify({
            fromDate: fromDate,
            toDate: fromDate,
            activeDateHeader: fromDate
          })
        );
        this.loadListofData();
      }
    );
  }

  generateHorizontalDateBlocks() {
    const act_date = new Date(this.state.activeDateHeader);
    return (
      <div className="calendar">
        <div className="col-12">
          <div className="row">
            {this.liGenerate().map((row, index) => {
              const _currDate = moment(row.currentdate).format("YYYYMMDD");
              const _activeDate = moment(act_date).format("YYYYMMDD");
              return (
                <div
                  // className="col"
                  key={index}
                  date={row.currentdate}
                  className={
                    _currDate === _activeDate
                      ? _currDate === moment().format("YYYYMMDD")
                        ? "col activeDate CurrentDate"
                        : "col activeDate"
                      : _currDate === moment().format("YYYYMMDD")
                      ? "col CurrentDate"
                      : "col"
                  }
                  onClick={this.onSelectedDateHandler.bind(this)}
                >
                  {row.day}
                  <span
                  // date={row.currentdate}
                  // onClick={this.onSelectedDateHandler.bind(this)}
                  >
                    {row.dayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="nurse_workbench">
        <div className="row">
          <div className="my-calendar col-lg-12">
            <div style={{ height: "34px" }}>
              <div className="myDay_date">
                <input
                  className="calender-date"
                  type="month"
                  onChange={this.monthChangeHandler.bind(this)}
                  value={moment(this.state.selectedHDate).format("YYYY-MM")}
                  max={moment(new Date()).format("YYYY-MM")}
                />
                <button className="btn btn-default btn-sm  todayBtn">
                  Today
                </button>
              </div>
            </div>
            {this.generateHorizontalDateBlocks()}
          </div>
        </div>
        <div className="row card-deck panel-layout">
          <div className="col-lg-4">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    <AlgaehLabel
                      label={{ fieldName: "patients_list", returnText: "true" }}
                    />
                  </h3>
                </div>
                <div className="actions rightLabelCount">
                  <AlgaehLabel label={{ fieldName: "total_patients" }} />
                  <span className="countNo">
                    {
                      Enumerable.from(this.state.data)
                        .where(w => w.status !== "V")
                        .toArray().length
                    }
                  </span>
                </div>
              </div>

              <div className="portlet-body">{/* Left */}</div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    <AlgaehLabel
                      label={{
                        fieldName: "encounter_list",
                        returnText: "true"
                      }}
                    />
                  </h3>
                </div>
                <div className="actions rightLabelCount">
                  {/* <AlgaehLabel label={{ fieldName: "total_encounters" }} />
                  <span className="countNo">
                    {
                      Enumerable.from(this.state.data)
                        .where(w => w.status !== "V")
                        .toArray().length
                    }
                  </span> */}
                </div>
              </div>

              <div className="portlet-body">{/* Right */}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NurseWorkbench;
