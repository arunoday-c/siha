import React, { useState, useEffect, useReducer } from "react";
import "./financeReportStyle.scss";
import {
  AlgaehMessagePop,
  AlgaehAutoComplete,
  AlgaehDateHandler
} from "algaeh-react-components";
import { Spin, Button, Tooltip, DatePicker } from "antd";
import Balance from "./FinanceStandardReports/balancesheet";
import TrailBalance from "./FinanceStandardReports/trailbalance";
// import ArAging from "./FinanceStandardReports/arAgingReport";
import AgingReport from "./FinanceStandardReports/AgingReport";
import CostCenter from "../costCenterComponent";
import { getBalanceSheet, downloadExcel } from "./FinanceReportEvents";
import { newAlgaehApi } from "../../hooks";
import PandLCostCenter from "./FinanceStandardReports/pandLCostCenter";
import moment from "moment";
import PandLYear from "./FinanceStandardReports/pandLYear";
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
  const [project_id, setProjectID] = useState(null);
  const [branch_id, setBranchID] = useState(null);
  const [cost_center_id, setCostCenterId] = useState(null);
  const [organization, setOrganization] = useState([]);
  const [costCenters, setCostCenters] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  const [layout, layoutDispatch] = useReducer(layoutReducer, {
    cols: 24,
    expand: false
  });
  const [trailBanlance, setTrailBalance] = useState({});

  useEffect(() => {
    async function initData() {
      try {
        const results = await Promise.all([
          newAlgaehApi({
            uri: "/finance_masters/getCostCentersForVoucher",
            module: "finance"
          }),
          newAlgaehApi({
            uri: "/finance_masters/getFinanceOption",
            module: "finance"
          })
        ]);
        setOrganization(results[0].data.result);
        const finOpts = results[1].data.result[0];
        setFinOptions(finOpts);
        setBranchID(finOpts.default_branch_id);
        setCostCenterId(finOpts.default_cost_center_id);
      } catch (e) {
        AlgaehMessagePop({
          info: "error",
          display: e.message || e.response.data.message
        });
      }
    }
    initData();
  }, []);

  useEffect(() => {
    if (branch_id) {
      const [required] = organization.filter(
        el => el.hims_d_hospital_id === branch_id
      );
      setCostCenters(required.cost_centers);
    }
  }, [branch_id]);

  function handleDropDown(_, value, name) {
    if (name === "branch_id") {
      setBranchID(value);
    } else if (name === "cost_center_id") {
      setCostCenterId(value);
    } else {
      setYear(value);
    }
  }

  function selectedClass(report) {
    return report === selected ? "active" : "";
  }

  function costCenterAssin({ projectID, branchID }) {
    if (projectID !== undefined) setProjectID(projectID);
    if (branchID !== undefined) setBranchID(branchID);
  }

  function loadData({ profitLoss }) {
    setData(profitLoss);
  }

  function loadReport(report) {
    const { url, reportName } = report;
    getBalanceSheet({
      url: url,
      inputParam: {
        hospital_id: branch_id,
        cost_center_id: project_id
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
  function onExportExcel() {
    downloadExcel({
      selected,
      inputParam: {
        hospital_id: branch_id,
        cost_center_id: project_id,
        year: year
      }
    })
      .then(response => {
        let blob = new Blob([response.data], {
          type: "application/octet-stream"
        });
        const fileName = `${selected}-${moment().format(
          "DD-MM-YYYY-HH-MM-ss"
        )}.xlsx`;
        var objectUrl = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.setAttribute("href", objectUrl);
        link.setAttribute("download", fileName);
        link.click();
      })
      .catch(error => {
        const { message } = error;
        AlgaehMessagePop({
          type: "error",
          display: message !== "" ? message : error.data.message
        });
      });
  }
  if (finOptions) {
    return (
      <div className="row">
        {/* <div className="col-12 topBarCostCenter">          
          <div className="row">            
            <CostCenter
              result={resultdata}
              propCenterID={String(finOptions.default_cost_center_id)}
              propBranchID={String(finOptions.default_branch_id)}
            />
          </div>
        </div> */}
        <div className="col-12">
          <div className="row">
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
                      setSelected("AP");
                    }
                  }}
                >
                  AP Aging
                </li>
                <li
                  className={selectedClass("PandL")}
                  onClick={() => {
                    if (checkExists()) {
                      setSelected("PandL");
                    }
                  }}
                >
                  Profit & Loss by Cost Center
                </li>{" "}
                <li
                  className={selectedClass("PandLYear")}
                  onClick={() => {
                    if (checkExists()) {
                      setSelected("PandLYear");
                    }
                  }}
                >
                  Profit & Loss by Month
                </li>
              </ul>
            </div>
            <div className="col reportPreviewSecLeft">
              <Spin
                spinning={loading}
                tip="Please wait report data is fetching.."
                delay={500}
              >
                {selected !== "" ? (
                  <button onClick={onExportExcel}>Excel</button>
                ) : null}

                {selected === "BS" ? (
                  <Balance
                    data={data}
                    layout={layout}
                    result={["asset", "liabilities"]}
                  />
                ) : selected === "PL" ? (
                  <>
                    <div className="col">
                      <div className="row">
                        <CostCenter
                          result={resultdata}
                          costCenterAssin={costCenterAssin}
                          loadData={loadData}
                          // propCenterID={String(finOptions.default_cost_center_id)}
                          // propBranchID={String(finOptions.default_branch_id)}
                        />
                      </div>
                    </div>

                    <Balance
                      data={data}
                      layout={layout}
                      result={["income", "expense"]}
                      footer={result => <div>Profit : {result.profit}</div>}
                    />
                  </>
                ) : selected === "TB" ? (
                  <TrailBalance layout={layout} data={trailBanlance} />
                ) : selected === "AR" ? (
                  <AgingReport layout={layout} type="receivable" />
                ) : selected === "AP" ? (
                  <AgingReport layout={layout} type="payable" />
                ) : selected === "PandL" ? (
                  <PandLCostCenter />
                ) : selected === "PandLYear" ? (
                  <>
                    <PandLYear
                      branch_id={branch_id}
                      cost_center_id={cost_center_id}
                      year={year}
                      handleDropDown={handleDropDown}
                      organization={organization}
                      costCenters={costCenters}
                    />
                  </>
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
                      disabled={!selected}
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
                        disabled={!selected}
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
                        disabled={!selected}
                        onClick={() => layoutDispatch({ type: "collapse" })}
                      />
                    </Tooltip>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
