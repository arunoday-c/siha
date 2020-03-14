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
import {
  getBalanceSheet,
  downloadExcel,
  handleFile
} from "./FinanceReportEvents";
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
  const [period, setPeriod] = useState("");
  const [dates, setDates] = useState(undefined);

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
    if (period) {
      newAlgaehApi({
        uri: "/finance_masters/getFinanceDate",
        module: "finance",
        data: {
          transaction_date: period
        }
      })
        .then(res => {
          const { success, result } = res.data;
          debugger;
          setDates([moment(result.from_date), moment(result.to_date)]);
        })
        .catch(e => console.log(e.message));
    }
  }, [period]);

  useEffect(() => {
    if (selected && finOptions) {
      switch (selected) {
        case "BS":
          loadReport({ url: "getBalanceSheet" });
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

  function onExportExcel(reportType) {
    downloadExcel({
      selected,
      inputParam: {
        hospital_id: finOptions.default_branch_id,
        cost_center_id: finOptions.default_cost_center_id
      }
    })
      .then(response => {
        handleFile(response.data, selected);
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
              <div className="row">
                <AlgaehAutoComplete
                  div={{ className: "col-3" }}
                  label={{
                    forceLabel: "Select Period",
                    isImp: true
                  }}
                  selector={{
                    name: "period",
                    value: period,
                    dataSource: {
                      data: [
                        {
                          name: "This month",
                          value: "TM"
                        },
                        {
                          name: "This Month till Date",
                          value: "TMTD"
                        },
                        {
                          name: "Last month",
                          value: "LM"
                        },
                        {
                          name: "Current Year",
                          value: "CY"
                        },
                        {
                          name: "Current Yeat till Date",
                          value: "CYTD"
                        }
                      ],
                      valueField: "value",
                      textField: "name"
                    },
                    onChange: (_, value) => {
                      setPeriod(value);
                    }
                  }}
                />
                <AlgaehDateHandler
                  div={{ className: "col-3" }}
                  label={{ forceLabel: "Selected Range" }}
                  type="range"
                  textBox={{
                    value: dates
                  }}
                  events={{
                    onChange: selected => {
                      setDates(selected);
                    }
                  }}
                />
              </div>
              <Spin
                spinning={loading}
                tip="Please wait report data is fetching.."
                delay={500}
              >
                {selected !== "PL" ? (
                  <button onClick={onExportExcel}>Excel</button>
                ) : null}
                <ReportMain
                  selected={selected}
                  data={data}
                  finOptions={finOptions}
                  layout={layout}
                  organization={organization}
                  downloadExcel={onExportExcel}
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
