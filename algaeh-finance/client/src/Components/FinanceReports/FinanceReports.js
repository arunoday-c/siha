import React, { useState, useEffect, useReducer } from "react";
import moment from "moment";
import {
  AlgaehMessagePop,
  AlgaehAutoComplete,
  AlgaehDateHandler,
} from "algaeh-react-components";
import { Spin } from "antd";
import { newAlgaehApi } from "../../hooks";
// import ToolBar from "./ToolBar";
import ReportNavBar from "./ReportNavBar";
import {
  // getBalanceSheet,
  downloadExcel,
  handleFile,
} from "./FinanceReportEvents";
import ReportMain from "./ReportMain";
import "./financeReportStyle.scss";
import ReportsMenu from "./reportsmenu";
import "./FinanceStandardReports/antTableCustomStyle.scss";
import { OrganizationContext } from "./context";
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
      return { ...state, expand: true };
    default:
      return state;
  }
}

export default function FinanceReports() {
  const [loading, setLoading] = useState(true);
  const [finOptions, setFinOptions] = useState(null);
  const [selected, setSelected] = useState("BS");
  const [selectedFilter, setSelectedFilter] = useState({});
  const [organization, setOrganization] = useState([]);
  const [organizationDetail, setOrganizationDetail] = useState({});
  const [layout, layoutDispatch] = useReducer(layoutReducer, {
    cols: 24,
    expand: true,
  });
  const [period, setPeriod] = useState("TMTD");
  const [dates, setDates] = useState(undefined);

  useEffect(() => {
    async function initData() {
      try {
        const results = await Promise.all([
          newAlgaehApi({
            uri: "/finance_masters/getCostCentersForVoucher",
            module: "finance",
          }),
          newAlgaehApi({
            uri: "/finance_masters/getFinanceOption",
            module: "finance",
          }),
          newAlgaehApi({
            uri: "/organization/getMainOrganization",
            method: "GET",
          }),
        ]);
        setOrganization(results[0].data.result);
        setOrganizationDetail(results[2].data.records);
        const finOpts = results[1].data.result[0];
        setFinOptions(finOpts);
        setLoading(false);
      } catch (e) {
        setLoading(false);

        AlgaehMessagePop({
          info: "error",
          display: e.message || e.response.data.message,
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
          transaction_date: period,
        },
      })
        .then((res) => {
          const { result } = res.data;
          setDates([moment(result.from_date), moment(result.to_date)]);
        })
        .catch((e) => console.log(e.message));
    }
  }, [period]);

  function onExportExcel(reportType) {
    downloadExcel({
      selected,
      inputParam: {
        hospital_id: finOptions.default_branch_id,
        cost_center_id: finOptions.default_cost_center_id,
      },
    })
      .then((response) => {
        handleFile(response.data, selected);
      })
      .catch((error) => {
        const { message } = error;
        AlgaehMessagePop({
          type: "error",
          display: message !== "" ? message : error.data.message,
        });
      });
  }
  function getReportName() {
    const reportT = ReportsMenu.find((f) => f.key === selected);
    if (reportT !== undefined) {
      return reportT.title;
    } else {
      return "";
    }
  }
  if (finOptions && dates) {
    return (
      <div className="row">
        <div className="col-12">
          <div className="row ">
            <ReportNavBar
              REPORT_LIST={ReportsMenu}
              setSelected={setSelected}
              setSelectedFilter={setSelectedFilter}
              selected={selected}
              selectedFilter={selectedFilter}
            />
            <div className="col reportPreviewSecLeft">
              <div
                className="row inner-top-search"
                style={{ padding: "15px 0", marginBottom: 0, border: "none" }}
              >
                <div className="col-12">
                  <h3>{getReportName()}</h3>
                  <hr></hr>
                </div>
                {/* <AlgaehAutoComplete
                  div={{ className: "col-4" }}
                  label={{
                    forceLabel: "Select Period",
                    isImp: true,
                  }}
                  selector={{
                    name: "period",
                    value: period,
                    dataSource: {
                      data: [
                        {
                          name: "This month",
                          value: "TM",
                        },
                        {
                          name: "This Month till Date",
                          value: "TMTD",
                        },
                        {
                          name: "Last month",
                          value: "LM",
                        },
                        {
                          name: "Current Year",
                          value: "CY",
                        },
                        {
                          name: "Current Yeat till Date",
                          value: "CYTD",
                        },
                      ],
                      valueField: "value",
                      textField: "name",
                    },
                    onChange: (_, value) => {
                      setPeriod(value);
                    },
                  }}
                />
                <AlgaehDateHandler
                  div={{ className: "col-4" }}
                  label={{ forceLabel: "Selected Range" }}
                  type="range"
                  textBox={{
                    value: dates,
                  }}
                  events={{
                    onChange: (selected) => {
                      setDates(selected);
                    },
                  }}
                /> */}
              </div>

              <div className="row">
                <Spin
                  spinning={loading}
                  tip="Please wait report data is fetching.."
                  delay={500}
                  className="abc"
                >
                  {/* {selected === "TB" ? (
                    <i
                      className="fas fa-file-download"
                      onClick={onExportExcel}
                    />
                  ) : null} */}
                  <OrganizationContext.Provider value={{ organizationDetail }}>
                    <ReportMain
                      selected={selected}
                      selectedFilter={selectedFilter}
                      dates={dates}
                      finOptions={finOptions}
                      layout={layout}
                      organization={organization}
                      downloadExcel={onExportExcel}
                    />
                  </OrganizationContext.Provider>
                </Spin>
              </div>
            </div>
            {/* <ToolBar
              selected={selected}
              layoutDispatch={layoutDispatch}
              layout={layout}
            /> */}
          </div>
        </div>
      </div>
    );
  }
  return null;
}
