import React, { useState, memo, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AlgaehDateHandler, AlgaehAutoComplete } from "algaeh-react-components";
import moment from "moment";
import { LabContext } from "./";
import { swalMessage } from "../../../utils/algaehApiCall";
const numberOfDays = 10;
export default memo(function HeaderBand(props) {
  const { setLabState } = useContext(LabContext);
  const [date, setDate] = useState(undefined);
  const [type, setType] = useState("V");
  const history = useHistory();
  const pathName = history.location.pathname;
  useEffect(() => {
    const parameters = new URLSearchParams(window.location.search);
    let _DATE_RANGES = [];
    if (parameters.get("from_date")) {
      _DATE_RANGES.push(moment(parameters.get("from_date"), "YYYY-MM-DD"));
    }
    if (parameters.get("to_date")) {
      _DATE_RANGES.push(moment(parameters.get("to_date"), "YYYY-MM-DD"));
    }
    if (parameters.get("status")) {
      setType(parameters.get("status"));
    }
    if (_DATE_RANGES.length > 0) setDate(_DATE_RANGES);
  }, []);
  function onLoadContext() {
    if (Array.isArray(date) && date.length > 0) {
      if (moment(date[1]).diff(moment(date[0]), "days") <= numberOfDays) {
        const _from_date = moment(date[0]).format("YYYY-MM-DD");
        const _to_date = moment(date[1]).format("YYYY-MM-DD");
        setLabState({
          DATE_RANGE: [_from_date, _to_date],
          STATUS: type,
          TRIGGER_LOAD: undefined,
        });
        history.push(
          pathName +
            `?from_date=${_from_date}&to_date=${_to_date}&status=${type}`
        );
      } else {
        swalMessage({
          type: "error",
          title: `Please select date range between ${numberOfDays} days`,
        });
      }
    }
  }
  function onClearContext() {
    setDate(undefined);
    setType("V");
    setLabState({ DATE_RANGE: undefined, STATUS: "V" });
    history.push(pathName);
  }
  return (
    <div className="hptl-phase1-result-entry-form">
      <div className="row inner-top-search" style={{ paddingBottom: "10px" }}>
        <AlgaehDateHandler
          div={{ className: "col-4" }}
          label={{
            forceLabel: "Ordered Date",
          }}
          textBox={{ className: "txt-fld", name: "from_date", value: date }}
          type="range"
          // maxDate={new Date()}
          events={{
            onChange: (e) => {
              setDate(e);
            },
            onClear: () => {
              setDate(undefined);
            },
          }}
        />
        <AlgaehAutoComplete
          div={{ className: "col-2" }}
          label={{
            forceLabel: "Status",
          }}
          selector={{
            value: type,
            onChange: (selected) => {
              setType(selected.value);
            },
            onClear: () => {
              setType(undefined);
            },
            dataSource: {
              textField: "text",
              valueField: "value",
              data: [
                { text: "Validated Result", value: "V" },
                { text: "Already Sent", value: "S" },
                // { text: "Unsent", value: "US" },
              ],
            },
          }}
        />
        <button
          className="btn btn-default btn-small"
          style={{ marginTop: 21 }}
          onClick={onClearContext}
        >
          clear
        </button>{" "}
        <button
          className="btn btn-primary btn-small"
          style={{ marginTop: 21, marginLeft: 5 }}
          onClick={onLoadContext}
        >
          load
        </button>
      </div>
    </div>
  );
});
