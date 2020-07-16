import React, { useRef, useEffect, useState } from "react";
import { Row, Col } from "antd";
import moment from "moment";
import ReactToPrint from "react-to-print";
import { PlotUI } from "./plotui";
import { newAlgaehApi } from "../../../hooks";
import { handleFile } from "../FinanceReportEvents";
import { AlgaehMessagePop } from "algaeh-react-components";
// import ReportHeader from "../header";
import Filter from "../filter";
import ReportLayout from "../printlayout";
// import { getItem, tokenDecode } from "algaeh-react-components/storage";
// import jwtDecode from "jwt-decode";
export default function BalanceSheet({
  style,
  footer,
  layout,
  dates,
  selectedFilter,
}) {
  // const createPrintObject = useRef(undefined);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [stopLoading, setStopLoading] = useState(undefined);
  const [preview, setPreview] = useState(false);
  const [rangeDate, setRangeDate] = useState([dates[0], dates[1]]);
  const [prevDateRange, setPrevDateRange] = useState([]);
  const [filter, setFilter] = useState([]);
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [changeInAmount, setChangeInAccount] = useState("N");
  const [changeInPercentage, setChangeInPercentage] = useState("N");
  const [reportType, setReportType] = useState("balancesheet");
  // const [hospitalDetails, setHospitalDeytails] = useState([]);
  // const [organisation, setOrganisation] = useState({});
  useEffect(() => {
    const { filterKey } = selectedFilter;
    if (filterKey !== undefined) {
      const newFilter = [];
      if (filterKey === "comparison") {
        newFilter.push({
          type: "DH|RANGE",
          data: "PREVIOUS RANGE",
          maxDate: moment(),
        });
        newFilter.push({
          type: "CH",
          data: "Change in amount",
        });
        newFilter.push({
          type: "CH",
          data: "Change in percentage",
        });
        setFilter(newFilter);
        setReportType(filterKey);
      } else {
        setFilter([]);
        setReportType("balancesheet");
      }
    } else {
      setFilter([]);
    }

    setTriggerUpdate((result) => {
      return !result;
    });
  }, [selectedFilter]);

  useEffect(() => {
    const { filterKey } = selectedFilter;
    if (filterKey !== undefined) {
      if (filterKey === "comparison") {
        loadcomparisionData(false);
      }
    } else {
      loadBalanceSheet();
    }
  }, [preview]);
  function loadcomparisionData(excel) {
    let extraHeaders = {};
    let others = {};
    if (excel === true) {
      extraHeaders = {
        Accept: "blob",
      };
      others = { responseType: "blob" };
    }
    const from_date = rangeDate[0].format("YYYY-MM-DD");
    const to_date = rangeDate[1].format("YYYY-MM-DD");
    let prev_from_date = undefined;
    let prev_to_date = undefined;
    if (Array.isArray(prevDateRange) && prevDateRange.length > 0) {
      prev_from_date = prevDateRange[0].format("YYYY-MM-DD");
      prev_to_date = prevDateRange[1].format("YYYY-MM-DD");
    }

    newAlgaehApi({
      uri: "/balanceSheetComparison/getBalanceSheet",
      module: "finance",
      data: {
        from_date,
        to_date,
        change_in_amount: changeInAmount,
        change_in_percent: changeInPercentage,
        excel,
      },
      extraHeaders,
      options: others,
    })
      .then((response) => {
        if (typeof stopLoading === "function") stopLoading();
        console.log("response", response);
        debugger;
      })
      .catch((error) => {
        if (typeof stopLoading === "function") stopLoading();
        AlgaehMessagePop({
          title: "error",
          display: error.message,
        });
      });
  }

  function loadBalanceSheet(excel) {
    let extraHeaders = {};
    let others = {};
    if (excel === true) {
      extraHeaders = {
        Accept: "blob",
      };
      others = { responseType: "blob" };
    }
    const f_date = rangeDate[0];
    const t_date = rangeDate[1];
    newAlgaehApi({
      uri: "/financeReports/getBalanceSheet",
      module: "finance",
      data: {
        from_date: f_date,
        to_date: t_date,
        excel,
      },
      extraHeaders,
      options: others,
    })
      .then((res) => {
        if (excel) {
          handleFile(res.data, "balance_sheet");
        } else {
          const { asset, liabilities } = res.data.result;
          let records = [];
          //For asset
          records.push(asset);
          //For liabilities
          records.push(liabilities);

          setColumns([
            { fieldName: "label", label: "Ledger Name" },
            { fieldName: "subtitle" },
          ]);
          setData(records);
        }
        if (typeof stopLoading === "function") stopLoading();
      })
      .catch((e) => {
        if (typeof stopLoading === "function") stopLoading();
        AlgaehMessagePop({
          title: "error",
          display: e.message,
        });
      });
  }
  function filterBuilder(existing, updated) {
    const newFilter = existing.concat(updated);
    return newFilter;
  }
  function BalanceScheet() {
    return (
      <>
        <div className="reportBodyArea">
          <Row gutter={[8, 8]}>
            <Col span={layout.col}>
              <div className="reportTableStyle">
                <ul className="treeListUL">
                  {PlotUI(data["liabilities"], style, [0], layout.expand)}
                </ul>
              </div>
            </Col>
            <Col span={layout.col}>
              <div className="reportTableStyle">
                <ul className="treeListUL">
                  {PlotUI(data["asset"], style, [0], layout.expand)}
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="reportTotalArea">
          <table style={{ width: "100%" }}>
            <tbody>
              <tr className="footerTotalArea">
                <td style={{ width: "100%" }} valign="top">
                  <b> {null}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }
  function Comparition() {
    return null;
  }
  // function DataLoading() {
  //   if (reportType === "balancesheet") {
  //     return <BalanceScheet />;
  //   } else if (reportType === "comparison") {
  //     return <Comparition />;
  //   }
  // }
  return (
    <>
      <div className="row inner-top-search">
        <Filter
          filters={filterBuilder(
            [
              {
                type: "AC",
                data: "PERIOD",
                initalStates: "TMTD",
                dependent: ["Range"],
              },
              {
                type: "DH|RANGE",
                data: "Range",
                initalStates: rangeDate,
              },
            ],
            filter
          )}
          callBack={(inputs, cb) => {
            const {
              CHANGEINAMOUNT,
              CHANGEINPERCENTAGE,
              PREVIOUSRANGE,
              RANGE,
            } = inputs;
            setRangeDate(RANGE);
            setPrevDateRange(PREVIOUSRANGE);
            setChangeInPercentage(CHANGEINPERCENTAGE);
            setChangeInAccount(CHANGEINAMOUNT);
            setStopLoading(cb);
            setPreview((result) => {
              return !result;
            });
            // console.log("inputs", inputs);
          }}
          triggerUpdate={triggerUpdate}
        />
      </div>
      {/* <div className="row">
        <div className="col-12 reportHeaderAction">
          <span>
            <i
              className="fas fa-file-download"
              onClick={() => loadBalanceSheet(true)}
            />
          </span>
          <span>
            <ReactToPrint
              trigger={() => <i className="fas fa-print" />}
              content={() => createPrintObject.current}
              removeAfterPrint={true}
              bodyClass="reportPreviewSecLeft"
              pageStyle="@media print {
              html, body {
                height: initial !important;
                overflow: initial !important;
                -webkit-print-color-adjust: exact;
              }
            }
            
            @page {
              size: auto;
              margin: 20mm;
            }"
            />
          </span>
        </div>
      </div> */}

      {/* <AlgaehButton
        onClick={() => loadBalanceSheet(true)}
        className="btn btn-default"
      >
        Download Excel
      </AlgaehButton> */}

      {/* <div className="row inner-top-search">
        <AlgaehDateHandler
          div={{
            className: "col-3 algaeh-date-fld"
          }}
          label={{
            forceLabel: "Select Date",
            isImp: true
          }}
          textBox={{
            name: "date",
            className: "form-control",
            value: date
          }}
          events={{
            onChange: momentDate => {
              if (momentDate) {
                setDate(momentDate._d);
              } else {
                setDate(undefined);
              }
            }
          }}
        />
      </div> */}

      {/* <div ref={createPrintObject}>
        <ReportHeader
          title={`Balance Sheet ${
            reportType === "comparison" ? "Comparison" : ""
          }`}
        />

        <DataLoading />
      </div> */}
      <ReportLayout
        title={`Balance Sheet ${
          reportType === "comparison" ? "Comparison" : ""
        }`}
        columns={columns}
        data={data}
        layout={layout}
      />
    </>
  );
}
