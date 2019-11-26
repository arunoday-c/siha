import React, { useState } from "react";
import "./financeReportStyle.scss";
import { Spin, AlgaehMessagePop } from "algaeh-react-components";
import Balance from "./FinanceStandardReports/balancesheet";
import { getBalanceSheet } from "./FinanceReportEvents";

export default function FinanceReports() {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("");
  const [data, setData] = useState({});
  function selectedClass(report) {
    return report === selected ? "active" : "";
  }
  function loadReport(report) {
    getBalanceSheet({ reportType: report })
      .then(result => {
        setLoading(false);
        setData(result);
      })
      .catch(error => {
        setLoading(false);
        setData([]);
        AlgaehMessagePop({
          title: "error",
          display: error
        });
      });
  }
  return (
    <div className="row">
      <div className="col-3 reportMenuSecLeft">
        <h6>Standard Report</h6>
        <ul className="menuListUl">
          <li
            className={selectedClass("BS")}
            onClick={e => {
              setLoading(true);
              setSelected("BS");
              loadReport("BS");
            }}
          >
            Balance Sheet
          </li>
          <li
            className={selectedClass("PL")}
            onClick={() => {
              setSelected("PL");
            }}
          >
            Profit and Loss
          </li>
        </ul>
      </div>
      <div className="col-9 reportPreviewSecLeft">
        <Spin spinning={loading} tip="Please wait report data is fetching..">
          <Balance data={data} result={["asset", "liabilities"]} />
        </Spin>{" "}
      </div>
    </div>
  );
}
