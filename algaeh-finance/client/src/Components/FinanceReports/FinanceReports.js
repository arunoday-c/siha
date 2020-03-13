import React, { useState, useEffect, useReducer } from "react";
import moment from "moment";
import {
  AlgaehMessagePop,
  AlgaehAutoComplete,
  AlgaehDateHandler
} from "algaeh-react-components";
import { Spin } from "antd";
import { newAlgaehApi } from "../../hooks";
import ToolBar from "./ToolBar";
import ReportNavBar from "./ReportNavBar";
import { getBalanceSheet, downloadExcel } from "./FinanceReportEvents";
import ReportMain from "./ReportMain";
import "./financeReportStyle.scss";

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
  const [selected, setSelected] = useState("BS");
  const [data, setData] = useState({});
  const [organization, setOrganization] = useState([]);
  const [layout, layoutDispatch] = useReducer(layoutReducer, {
    cols: 24,
    expand: false
  });

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
    if (selected && finOptions) {
      switch (selected) {
        case "BS":
          loadReport({ url: "getBalanceSheet" });
          break;
        case "PL":
          loadReport({ url: "getProfitAndLoss" });
          break;
        case "TB":
          loadReport({ url: "getTrialBalance", reportName: "TB" });
          break;
        default:
          break;
      }
    }
  }, [selected, finOptions]);

  function loadReport(report) {
    const { url, reportName } = report;
    getBalanceSheet({
      url: url,
      inputParam: {
        hospital_id: finOptions.default_branch_id,
        cost_center_id: finOptions.default_cost_center_id
      }
    })
      .then(result => {
        setData(result);
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

  function onExportExcel() {
    downloadExcel({
      selected,
      inputParam: {
        hospital_id: finOptions.default_branch_id,
        cost_center_id: finOptions.default_cost_center_id
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
        <div className="col-12">
          <div className="row">
            <ReportNavBar setSelected={setSelected} selected={selected} />
            <div className="col reportPreviewSecLeft">
              <Spin
                spinning={loading}
                tip="Please wait report data is fetching.."
                delay={500}
              >
                <button onClick={onExportExcel}>Excel</button>
                <ReportMain
                  selected={selected}
                  data={data}
                  finOptions={finOptions}
                  layout={layout}
                  organization={organization}
                />
              </Spin>
            </div>
            <ToolBar
              selected={selected}
              layoutDispatch={layoutDispatch}
              layout={layout}
            />
          </div>
        </div>
      </div>
    );
  }
  return null;
}
