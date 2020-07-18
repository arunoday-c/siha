import React, { useRef, useEffect, useState } from "react";
import moment from "moment";
import ReactToPrint from "react-to-print";
import { PlotUI } from "./plotui";
import { newAlgaehApi } from "../../../hooks";
import { handleFile } from "../FinanceReportEvents";
import { AlgaehMessagePop } from "algaeh-react-components";
import Filter from "../filter";
import ReportLayout from "../printlayout";
export default function BalanceSheet({
  style,
  footer,
  layout,
  dates,
  selectedFilter,
}) {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [stopLoading, setStopLoading] = useState(undefined);
  const [preview, setPreview] = useState(undefined);
  const [rangeDate, setRangeDate] = useState([dates[0], dates[1]]);
  const [prevDateRange, setPrevDateRange] = useState([]);
  const [filter, setFilter] = useState([]);
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [changeInAmount, setChangeInAccount] = useState("N");
  const [changeInPercentage, setChangeInPercentage] = useState("N");
  const [reportType, setReportType] = useState("balancesheet");
  useEffect(() => {
    const { filterKey } = selectedFilter;
    if (filterKey !== undefined) {
      const newFilter = [];
      if (filterKey === "comparison") {
        newFilter.push({
          className: "col-3 form-group",
          type: "DH|RANGE",
          data: "PREVIOUS RANGE",
          maxDate: moment(),
        });
        newFilter.push({
          className: "col-2 formgroup finCusCheckBox",
          type: "CH",
          data: "Change in Amt.",
        });
        newFilter.push({
          className: "col-2 formgroup finCusCheckBox",
          type: "CH",
          data: "Change in %",
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
    setPreview(undefined);
    setTriggerUpdate((result) => {
      return !result;
    });
  }, [selectedFilter]);

  useEffect(() => {
    if (preview !== undefined) {
      const { filterKey } = selectedFilter;
      if (filterKey !== undefined) {
        if (filterKey === "comparison") {
          loadcomparisionData(false);
        }
      } else {
        loadBalanceSheet();
      }
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
        prev_from_date,
        prev_to_date,
        excel,
      },
      extraHeaders,
      options: others,
    })
      .then((response) => {
        const { records } = response.data;

        const { columns: col, asset, liabilities } = records;
        let cols = col.map((item) => {
          return {
            fieldName: item.column_id,
            label: item.label,
          };
        });
        cols.unshift({
          fieldName: "label",
          label: "Ledger Name",
          freezable: true,
        });
        let details = [];
        //For asset
        details.push(asset);
        //For liabilities
        details.push(liabilities);
        setColumns(cols);
        setData(details);
        if (typeof stopLoading === "function") stopLoading();
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
            { fieldName: "label", label: "Ledger Name", freezable: true },
            { fieldName: "subtitle", label: "Total" },
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

  return (
    <>
      <div className="row inner-top-search">
        <Filter
          filters={filterBuilder(
            [
              {
                className: "col-2 form-group",
                type: "AC",
                data: "PERIOD",
                initalStates: "TMTD",
                dependent: ["Range"],
              },
              {
                className: "col-3 form-group",
                type: "DH|RANGE",
                data: "RANGE",
                initalStates: rangeDate,
                onChange: (selected, val, cb) => {
                  if (filter.length > 0) {
                    const frdt = selected[0].clone();
                    const tdt = selected[1].clone();
                    const previousfrom = frdt.subtract(1, "years");
                    const previousto = tdt.subtract(1, "years");
                    cb({
                      PREVIOUSRANGE: [previousfrom, previousto],
                      RANGE: selected,
                    });
                  } else {
                    cb({ RANGE: selected });
                  }
                },
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
              return result === undefined ? false : !result;
            });
          }}
          triggerUpdate={triggerUpdate}
        />
      </div>

      <ReportLayout
        title={`Balance Sheet ${
          reportType === "comparison" ? "Comparison" : ""
        }`}
        columns={preview === undefined ? [] : columns}
        data={preview === undefined ? [] : data}
        layout={layout}
      />
    </>
  );
}
