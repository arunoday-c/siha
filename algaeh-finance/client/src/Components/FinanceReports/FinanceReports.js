import React, { useState } from "react";
import "./financeReportStyle.scss";
import { Spin, AlgaehMessagePop } from "algaeh-react-components";
import Balance from "./FinanceStandardReports/balancesheet";
import TrailBalance from "./FinanceStandardReports/trailbalance";
import CostCenter from "../costCenterComponent";
import { getBalanceSheet } from "./FinanceReportEvents";
let resultdata = {};
export default function FinanceReports() {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("");
  const [data, setData] = useState({});
  const [trailBanlance, setTrailBalance] = useState({});

  function selectedClass(report) {
    return report === selected ? "active" : "";
  }
  function loadReport(report) {
    const { url, reportName } = report;
    getBalanceSheet({
      url: url,
      inputParam: {
        hospital_id: resultdata["hospital_id"],
        cost_center_id: resultdata["cost_center_id"]
      }
    })
      .then(result => {
        setLoading(false);
        if (reportName === "TB") {
          setTrailBalance(result);
        } else {
          setData(result);
        }
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

  function checkExists() {
    if (Object.keys(resultdata).length === 0) {
      AlgaehMessagePop({
        title: "info",
        display: "Please select Branch and Cost Center"
      });
      return false;
    } else {
      if (
        resultdata["hospital_id"] === undefined ||
        resultdata["cost_center_id"] === undefined
      ) {
        AlgaehMessagePop({
          title: "info",
          display: "Branch and Cost Center are mandatory."
        });
        return false;
      } else {
        return true;
      }
    }
  }

  return (
    <div className="row">
      {" "}
      <CostCenter result={resultdata} />
      <div className="col reportMenuSecLeft">
        <h6>Favourite Reports</h6>
        <ul className="menuListUl">
          <li
            className={selectedClass("BS")}
            onClick={e => {
              if (checkExists()) {
                setLoading(true);
                setSelected("BS");
                loadReport({ url: "getBalanceSheet" });
              }
            }}
          >
            Balance Sheet
          </li>
          <li
            className={selectedClass("PL")}
            onClick={() => {
              if (checkExists()) {
                loadReport({ url: "getProfitAndLoss" });
                setLoading(true);
                setSelected("PL");
              }
            }}
          >
            Profit and Loss
          </li>
          <li
            className={selectedClass("TB")}
            onClick={() => {
              if (checkExists()) {
                loadReport({ url: "getTrialBalance", reportName: "TB" });
                setLoading(true);
                setSelected("TB");
              }
            }}
          >
            Trail Balance
          </li>
        </ul>
      </div>
      <div className="col reportPreviewSecLeft">
        <Spin spinning={loading} tip="Please wait report data is fetching..">
          {selected === "BS" ? (
            <Balance data={data} result={["asset", "liabilities"]} />
          ) : selected === "PL" ? (
            <Balance
              data={data}
              result={["income", "expense"]}
              footer={result => <div>Profit : {result.profit}</div>}
            />
          ) : selected === "TB" ? (
            <TrailBalance data={trailBanlance} />
          ) : null}
        </Spin>{" "}
      </div>
    </div>
  );
}
