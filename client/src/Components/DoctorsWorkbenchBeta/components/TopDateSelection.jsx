import React, { useContext, useState, useEffect, memo } from "react";
import { MainContext, DatePicker } from "algaeh-react-components";
import { useHistory } from "react-router-dom";
import { ClinicalDeskContext } from "../ClinicalDeskContext";
import moment from "moment";
export default memo(function TopSelection(props) {
  const { userLanguage } = useContext(MainContext);
  const history = useHistory();
  const pathName = history.location.pathname;
  const { setWorkBenchDate, workBenchDate } = useContext(ClinicalDeskContext);
  const [activeDateHeader, setActiveDateHeader] = useState(
    moment().startOf("month")
  );
  const [generatedDates, setGeneratedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [isChangedDate, setIsChangedDate] = useState(false);
  useEffect(() => {
    if (workBenchDate && workBenchDate !== "") {
      setActiveDateHeader(moment(workBenchDate));
      setSelectedDate(moment(workBenchDate));
    } else {
      setSelectedDate(moment(workBenchDate));
    }
  }, [workBenchDate]);
  useEffect(() => {
    let ADH = activeDateHeader;
    if (workBenchDate && workBenchDate !== "" && isChangedDate === false) {
      ADH = moment(workBenchDate);
    }
    if (ADH) {
      let start = moment(ADH).startOf("month");
      let end = moment(ADH).endOf("month");
      let generatedLi = [];
      while (start < end) {
        const dt = moment(start);
        generatedLi.push({
          day: dt.clone().format("DD"),
          day_ar: new Date(dt.clone()._d).toLocaleDateString("ar-EG", {
            day: "2-digit",
          }),
          dayName_ar: new Date(dt.clone()._d).toLocaleDateString("ar-EG", {
            weekday: "narrow",
          }),
          currentDate: dt.format("YYYY-MM-DD"),
          dayName: dt.clone().format("ddd"),
        });

        const newDate = start.add(1, "days"); //setDate(start.getDate() + 1);
        start = newDate;
      }
      setGeneratedDates(generatedLi);
    }
  }, [activeDateHeader]);
  function onChangeMonth(value) {
    let selDate = value;
    if (value) {
      selDate = value.startOf("month");
    } else {
      selDate = undefined;
    }
    setIsChangedDate(true);
    setActiveDateHeader(selDate);
  }
  function onChangeSelectDate(e) {
    setSelectedDate(moment(e.currentTarget?.dataset?.date));
    setWorkBenchDate(e.currentTarget?.dataset?.date);
    history.push(
      pathName +
        `?workBenchDate=${moment(e.currentTarget?.dataset?.date).format(
          "YYYY-MM-DD"
        )}`
    );
  }
  const selDate =
    typeof selectedDate === "string" ? moment(selectedDate) : selectedDate;
  return (
    <div className="row">
      <div className="my-calendar col-lg-12">
        <div style={{ height: "34px" }}>
          <div className="myDay_date">
            <DatePicker
              picker="month"
              onChange={onChangeMonth}
              style={{
                width: 200,
                border: "1px dashed #fff",
                background: "transparent",
                color: "#fff !important",
              }}
              value={activeDateHeader}
            />
          </div>
        </div>
        <div className="calendar">
          <div className="col-12">
            <div className="row">
              <ul className="calendarDays">
                {generatedDates.map((row) => {
                  return (
                    <li
                      key={row.currentDate}
                      data-date={row.currentDate}
                      className={
                        row.currentDate === selDate.format("YYYY-MM-DD")
                          ? `activeDate ${
                              row.currentDate === moment().format("YYYY-MM-DD")
                                ? " CurrentDate"
                                : ""
                            }`
                          : `${
                              row.currentDate === moment().format("YYYY-MM-DD")
                                ? " CurrentDate"
                                : ""
                            }`
                      }
                      onClick={onChangeSelectDate}
                    >
                      {userLanguage === "ar" ? row.day_ar : row.day}
                      <span date={row.currentDate}>
                        {userLanguage === "ar" ? row.dayName_ar : row.dayName}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
