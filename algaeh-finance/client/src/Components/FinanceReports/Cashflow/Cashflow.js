import React, { useState } from "react";
import moment from "moment";
// import { getItem, tokenDecode } from "algaeh-react-components/storage";
// import jwtDecode from "jwt-decode";
// import { newAlgaehApi } from "../../../hooks";
// import { AlgaehMessagePop, AlgaehAutoComplete } from "algaeh-react-components";
import Details from "./detailreport";
import { AlgaehDateHandler } from "algaeh-react-components";
// import ReportHeader from "../header";
// import ReactToPrint from "react-to-print";
export function Cashflow({ layout }) {
  // const [organisation, setOrganisation] = useState({});
  const [dates, setDates] = useState([moment().startOf("month"), moment()]);
  const [displayColumn] = useState("T");
  const [showArabic, setShowArabic] = useState(false);
  const [hideZero, setHideZero] = useState(false);
  const [showLedgerCode, setShowLedgerCode] = useState(false);

  return (
    <div className="row">
      <AlgaehDateHandler
        div={{ className: "col-4 form-group mandatory" }}
        label={{
          forceLabel: "Date Range",
          isImp: true,
        }}
        textBox={{
          className: "txt-fld",
          name: "primary_effective_start_date",
          value: dates || undefined,
        }}
        type="range"
        events={{
          onChange: (mdate) => {
            setDates(mdate);
            // if (mdate) {
            //   onChange(mdate._d);
            // } else {
            //   onChange(undefined);
            // }
          },
          onClear: () => {
            // onChange(undefined);
            setDates([]);
          },
        }}
      />

      <div className="col-2">
        <label>SHOW LEDGER CODE</label>
        <div className="customCheckbox">
          <label className="checkbox inline">
            <input
              type="checkbox"
              checked={showLedgerCode}
              onChange={(e) => {
                const checked = e.target.checked;
                setShowLedgerCode(checked);
              }}
            />
            <span> Yes</span>
          </label>
        </div>
      </div>
      <div className="col-3">
        <label>SHOW ACCOUNT NAME IN ARABIC</label>
        <div className="customCheckbox">
          <label className="checkbox inline">
            <input
              type="checkbox"
              checked={showArabic}
              onChange={(e) => {
                const checked = e.target.checked;
                setShowArabic(checked);
              }}
            />
            <span> Yes</span>
          </label>
        </div>
      </div>
      <div className="col-2">
        <label>HIDE ZERO ACCOUNT</label>
        <div className="customCheckbox">
          <label className="checkbox inline">
            <input
              type="checkbox"
              checked={hideZero}
              onChange={(e) => {
                const checked = e.target.checked;
                setHideZero(checked);
              }}
            />
            <span> Yes</span>
          </label>
        </div>
      </div>
      <Details
        from_date={
          dates.length > 0
            ? moment(dates[0]).format("YYYY-MM-DD")
            : moment().format("YYYY-MM-DD")
        }
        to_date={
          dates.length > 0
            ? moment(dates[1]).format("YYYY-MM-DD")
            : moment().format("YYYY-MM-DD")
        }
        display_column_by={displayColumn}
        showArabic={showArabic}
        hideZero={hideZero}
        showLedgerCode={showLedgerCode}
      />
    </div>
  );
}
