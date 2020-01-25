import React, { useState, useEffect, useReducer } from "react";
import "./financeReportStyle.scss";
import { AlgaehMessagePop } from "algaeh-react-components";
import { Spin, Button, Tooltip } from "antd";
import Balance from "./FinanceStandardReports/balancesheet";
import TrailBalance from "./FinanceStandardReports/trailbalance";
import ArAging from "./FinanceStandardReports/arAgingReport";
import ApAging from "./FinanceStandardReports/apAgingReport";
import CostCenter from "../costCenterComponent";
import { getBalanceSheet } from "./FinanceReportEvents";
import { newAlgaehApi } from "../../hooks";
let resultdata = {};

function layoutReducer(state, action) {
  switch (action.type) {
    case "singleCol":
      return { ...state, col: 24 };
    case "doubleCol":
      return { ...state, col: 12 };
    case "switchCol":
      return { ...state, col: state.col === 12 ? 24 : 12 };
    case "expand":
      return { ...state, expand: true };
    case "collapse":
      return { ...state, expand: false };
    default:
      return state;
  }
}

export default function FinanceReports() {
  const [loading, setLoading] = useState(false);
  const [finOptions, setFinOptions] = useState(null);
  const [selected, setSelected] = useState("");
  const [data, setData] = useState({});
  const [layout, layoutDispatch] = useReducer(layoutReducer, {
    cols: 24,
    expand: false
  });
  const [trailBanlance, setTrailBalance] = useState({});

  useEffect(() => {
    setLoading(true);
    newAlgaehApi({
      uri: "/finance_masters/getFinanceOption",
      module: "finance"
    })
      .then(res => {
        setFinOptions(res.data.result[0]);
        setLoading(false);
      })
      .catch(e => {
        AlgaehMessagePop({
          type: "error",
          display: e.response.data.message
        });
        setLoading(false);
      });
  }, []);

  function selectedClass(report) {
    return report === selected ? "active" : "";
  }

  function loadReport(report) {
    const { url, reportName } = report;
    getBalanceSheet({
      url: url,
      inputParam: {
        hospital_id: resultdata["hospital_id"] || finOptions.default_branch_id,
        cost_center_id:
          resultdata["cost_center_id"] || finOptions.default_cost_center_id
      }
    })
      .then(result => {
        if (reportName === "TB") {
          setTrailBalance(result);
        } else {
          setData(result);
        }
        setLoading(false);
      })
      .catch(error => {
        setData([]);
        AlgaehMessagePop({
          title: "error",
          display: error
        });
        setLoading(false);
      });
  }

  function checkExists() {
    if (!finOptions) {
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
    } else {
      return true;
    }
  }

  if (finOptions) {
    return (
      <div className="row">
        <CostCenter
          result={resultdata}
          propBranchID={String(finOptions.default_branch_id)}
          propCenterID={String(finOptions.default_cost_center_id)}
        />
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
            </li>{" "}
            <li
              className={selectedClass("AR")}
              onClick={() => {
                if (checkExists()) {
                  //loadReport({ url: "getArAging", reportName: "AR" });
                  //  setLoading(true);
                  setSelected("AR");
                }
              }}
            >
              AR Aging
            </li>
            <li
              className={selectedClass("AP")}
              onClick={() => {
                if (checkExists()) {
                  // loadReport({ url: "getApAging", reportName: "AP" });
                  // setLoading(true);
                  setSelected("AP");
                }
              }}
            >
              AP Aging
            </li>
          </ul>
        </div>
        <div className="col reportPreviewSecLeft">
          <Spin
            spinning={loading}
            tip="Please wait report data is fetching.."
            delay={500}
          >
            {selected === "BS" ? (
              <Balance
                data={data}
                layout={layout}
                result={["asset", "liabilities"]}
              />
            ) : selected === "PL" ? (
              <Balance
                data={data}
                layout={layout}
                result={["income", "expense"]}
                footer={result => <div>Profit : {result.profit}</div>}
              />
            ) : selected === "TB" ? (
              <TrailBalance layout={layout} data={trailBanlance} />
            ) : selected === "AR" ? (
              <ArAging layout={layout} />
            ) : selected === "AP" ? (
              <ApAging layout={layout} />
            ) : null}
          </Spin>
        </div>
        <div className="col reportPreviewToolRight">
          <ul>
            <li>
              <Tooltip title="Change Layout" placement="left">
                <Button
                  icon="layout"
                  size="large"
                  onClick={() => layoutDispatch({ type: "switchCol" })}
                />
              </Tooltip>
            </li>
            {!layout.expand ? (
              <li>
                <Tooltip title="Expand" placement="left">
                  <Button
                    icon="arrows-alt"
                    size="large"
                    onClick={() => layoutDispatch({ type: "expand" })}
                  />
                </Tooltip>
              </li>
            ) : (
              <li>
                <Tooltip title="Shrink" placement="left">
                  <Button
                    icon="shrink"
                    size="large"
                    onClick={() => layoutDispatch({ type: "collapse" })}
                  />
                </Tooltip>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
  return null;
}
