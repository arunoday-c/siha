import React, { useEffect, useState } from "react";
import { AlgaehMessagePop } from "algaeh-react-components";
import Filter from "../filter";
import ReportLayout from "../printlayout";
import DrillDown from "../drillDown";
import moment from "moment";
import { newAlgaehApi } from "../../../hooks";
import { getAmountFormart } from "../../../utils/GlobalFunctions";
export default function BalanceSheet({
  style,
  footer,
  layout,
  dates,
  selectedFilter,
  type,
}) {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [firstLevel, setFirstLevel] = useState([]);
  const [stopLoading, setStopLoading] = useState(undefined);
  const [preview, setPreview] = useState(undefined);
  const [rangeDate, setRangeDate] = useState([dates[0], dates[1]]);
  const [prevDateRange, setPrevDateRange] = useState([]);
  const [filter, setFilter] = useState([]);
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [changeInAmount, setChangeInAccount] = useState("N");
  const [changeInPercentage, setChangeInPercentage] = useState("N");
  const [reportType, setReportType] = useState("balancesheet");
  const [BasedOn, setBasedOn] = useState("by_year");
  const [tableProps, setTableProps] = useState({});
  const [levels, setLevels] = useState("2");
  const [showArabic, setArabic] = useState(false);
  const [showLedgerCode, setShowLedgerCode] = useState(false);
  const [nonZero, setNonZero] = useState(false);
  const [showDrillDown, setShowDrillDown] = useState(false);
  const [row, setRow] = useState(undefined);
  const [changedDateRange, setChangedDateRange] = useState([]);
  useEffect(() => {
    const { filterKey } = selectedFilter;
    if (filterKey !== undefined) {
      let newFilter = [];
      if (filterKey === "comparison") {
        newFilter = [
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
          {
            className: "col-3 form-group",
            type: "DH|RANGE",
            data: "PREVIOUS RANGE",
            maxDate: moment(),
          },
          {
            className: "col-2 formgroup finCusCheckBox",
            type: "CH",
            data: "Change in Amt.",
            checkText: "Yes",
            labelText: "Change in Amt.",
          },
          {
            className: "col-2 formgroup finCusCheckBox",
            type: "CH",
            data: "Change in %",
            checkText: "Yes",
            labelText: "Change in %",
          },
          {
            className: "col-2 form-group",
            type: "AC",
            data: "LEVELS",
            initalStates: "2",
          },
        ];
        setFilter(newFilter);
        setFirstLevel([]);
        setReportType(filterKey);
      } else {
        setFilter([
          {
            className: "col-3 form-group",
            type: "DH|RANGE",
            data: "RANGE",
          },
        ]);
        setFirstLevel([
          {
            className: "col-2 form-group",
            type: "AC",
            data: "BASEDON",
            initalStates: "by_year",
          },
          {
            className: "col-2 form-group",
            type: "AC",
            data: "LEVELS",
            initalStates: "2",
          },
        ]);
        setReportType("balancesheet");
      }
    } else {
      setFilter([
        {
          className: "col-3 form-group",
          type: "DH|RANGE",
          data: "RANGE",
        },
      ]);
      setFirstLevel([
        {
          className: "col-2 form-group",
          type: "AC",
          data: "BASEDON",
          initalStates: "by_year",
        },
        {
          className: "col-2 form-group",
          type: "AC",
          data: "LEVELS",
          initalStates: "2",
        },
      ]);
    }
    setPreview(undefined);
    setTriggerUpdate((result) => {
      return !result;
    });
  }, [selectedFilter]); // eslint-disable-line

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
  }, [preview]); // eslint-disable-line

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
    let uri = "/balanceSheetComparison/getBalanceSheet";
    if (type === "pandl") {
      uri = "/pl_comparison/getPlComparison";
    }
    newAlgaehApi({
      uri: uri,
      module: "finance",
      data: {
        from_date,
        to_date,
        change_in_amount: changeInAmount,
        change_in_percent: changeInPercentage,
        prev_from_date,
        prev_to_date,
        excel,
        levels,
        nonZero: nonZero ? "Y" : "N",
      },
      extraHeaders,
      options: others,
    })
      .then((response) => {
        const { records } = response.data;

        if (type === "balance") {
          forBalanceComparision(records);
        } else if (type === "pandl") {
          forPandLComparision(records);
        }
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
  function forBalanceComparision(records) {
    const { columns: col, asset, liabilities } = records;
    let cols = col.map((item) => {
      return {
        fieldName: item.column_id,
        label: item.label,
        displayTemplate: (row) => {
          const { startOff_date, cutOff_date } = item;
          const rec = getAmountFormart(row[item.column_id], {
            appendSymbol: false,
          });
          if (startOff_date && cutOff_date && row.leafnode === "Y") {
            return (
              <a
                href="void(0);"
                onClick={(e) => {
                  e.preventDefault();
                  setChangedDateRange([
                    moment(startOff_date),
                    moment(cutOff_date),
                  ]);
                  OpenDrillDown(row);
                }}
              >
                {rec}
              </a>
            );
          }
          return rec;
        },
      };
    });
    cols.unshift({
      fieldName: showArabic ? "arabic_name" : "label",
      label: "Ledger Name",
      freezable: true,
    });
    if (showLedgerCode) {
      cols.unshift({
        fieldName: "ledger_code",
        label: "Ledger Code",
        freezable: true,
      });
    }
    let details = [];
    //For asset
    details.push(asset);
    //For liabilities
    details.push(liabilities);
    setColumns(cols);
    setData(details);
    setTableProps({});
  }
  function forPandLComparision(records) {
    const { columns, income, Direct_expense, Indirect_expense } = records;
    let cols = columns.map((col) => {
      const { column_id, label } = col;
      return {
        fieldName: column_id,
        label: label,
        displayTemplate: (row) => {
          return getAmountFormart(row[column_id], { appendSymbol: false });
        },
      };
    });

    cols.unshift({
      fieldName: showArabic ? "arabic_name" : "label",
      label: "Ledger Name",
      freezable: true,
      // filterable: true
    });
    if (showLedgerCode) {
      cols.unshift({
        fieldName: "ledger_code",
        label: "Ledger Code",
        freezable: true,
      });
    }
    setColumns(cols);
    let createBox = [];
    //For income
    createBox.push(income);
    //For Direct Expense
    createBox.push(Direct_expense);
    //For Indirect Expense
    //For Indirect Expense
    if (Array.isArray(Indirect_expense)) {
      Indirect_expense.forEach((item) => {
        createBox.push(item);
      });
    } else {
      createBox.push(Indirect_expense);
    }
    setData(createBox);
    setTableProps({});
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
    const f_date = rangeDate[0].format("YYYY-MM-DD");
    const t_date = rangeDate[1].format("YYYY-MM-DD");
    const display_column_by =
      BasedOn === "by_year"
        ? "Y"
        : BasedOn === "by_center"
        ? "CC"
        : BasedOn === "total"
        ? "T"
        : "M";
    //balanceSheet_report/getBalanceSheet?from_date=2018-01-28&to_date=2020-08-20&display_column_by=[M,Y,T,CC]
    ///profit_and_loss_report/getProfitAndLoss?from_date=2019-01-28&to_date=2020-08-20&display_column_by=[M,Y,T,CC]
    let uri = "/balanceSheet_report/getBalanceSheet";
    if (type === "pandl") {
      uri = "/profit_and_loss_report/getProfitAndLoss";
    }
    newAlgaehApi({
      uri: uri,
      module: "finance",
      data: {
        from_date: f_date,
        to_date: t_date,
        excel,
        display_column_by,
        levels,
        nonZero: nonZero ? "Y" : "N",
      },
      extraHeaders,
      options: others,
    })
      .then((res) => {
        const { records } = res.data;
        if (type === "balance") {
          forBalanceSheet(records);
        } else if (type === "pandl") {
          forPandL(records);
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
  function forPandL(records) {
    const {
      columns,
      income,
      Direct_expense,
      Indirect_expense,
      gross_profit,
      net_profit,
    } = records;
    let cols = [];
    cols = columns.map((item) => {
      // const freezable = item.column_id === "total" ? { freezable: true } : {};
      return {
        fieldName: item.column_id,
        label: item.label,
        displayTemplate: (row) => {
          const rec = getAmountFormart(row[item.column_id], {
            appendSymbol: false,
          });
          if (row.leafnode === "Y") {
            return (
              <a
                href="void(0);"
                onClick={(e) => {
                  e.preventDefault();
                  if (BasedOn === "by_month") {
                    const on_month_from = moment(
                      `${item.column_id}01`,
                      "YYYYMMDD"
                    );
                    const on_month_to = on_month_from.clone().endOf("month");
                    setChangedDateRange([on_month_from, on_month_to]);
                  }
                  OpenDrillDown(row);
                }}
              >
                {rec}
              </a>
            );
          } else {
            return rec;
          }
        },
      };
    });
    cols.unshift({
      fieldName: showArabic ? "arabic_name" : "label",
      label: "Ledger Name",
      freezable: true,
    });
    if (showLedgerCode) {
      cols.unshift({
        fieldName: "ledger_code",
        label: "Ledger Code",
        freezable: true,
      });
    }
    setColumns(cols);
    let details = [];
    //for Income
    if (Array.isArray(income)) {
      income.forEach((item) => {
        details.push(item);
      });
    } else {
      details.push(income);
    }
    //for Indirect_expense
    if (Array.isArray(Indirect_expense)) {
      Indirect_expense.forEach((item) => {
        details.push(item);
      });
    } else {
      details.push(Indirect_expense);
    }

    //for gross_profit
    if (Array.isArray(gross_profit)) {
      gross_profit.forEach((item) => {
        details.push(item);
      });
    } else {
      details.push(gross_profit);
    }

    //for Direct_expense
    if (Array.isArray(Direct_expense)) {
      Direct_expense.forEach((item) => {
        details.push(item);
      });
    } else {
      details.push(Direct_expense);
    }

    const generateFooter = {
      aggregate: (fieldName) => {
        // console.log("fieldName", fieldName);
        // console.log("row", row);
        if (fieldName && fieldName !== "label") {
          return net_profit[fieldName];
        } else {
          return "Net Profit";
        }
      },
      footer: true,
    };
    setTableProps(generateFooter);
    setData(details);
  }
  function forBalanceSheet(records) {
    const { columns, asset, liabilities } = records;
    let cols = [];
    cols = columns.map((item) => {
      return {
        fieldName: item.column_id,
        label: item.label,
        displayTemplate: (row) => {
          const rec = getAmountFormart(row[item.column_id], {
            appendSymbol: false,
          });
          if (row.leafnode === "Y") {
            return (
              <a
                className="underLine"
                href="void(0);"
                onClick={(e) => {
                  e.preventDefault();
                  if (BasedOn === "by_month") {
                    const on_month_from = moment(
                      `${item.column_id}01`,
                      "YYYYMMDD"
                    );
                    const on_month_to = on_month_from.clone().endOf("month");
                    setChangedDateRange([on_month_from, on_month_to]);
                  }
                  OpenDrillDown(row);
                }}
              >
                {rec}
              </a>
            );
          } else {
            return rec;
          }
        },
      };
    });
    cols.unshift({
      fieldName: showArabic ? "arabic_name" : "label",
      label: "Ledger Name",
      freezable: true,
    });

    if (showLedgerCode) {
      cols.unshift({
        fieldName: "ledger_code",
        label: "Ledger Code",
        freezable: true,
      });
    }

    setColumns(cols);
    let details = [];
    //For asset
    details.push(asset);
    //For liabilities
    details.push(liabilities);
    setData(details);
    setTableProps({});
  }

  function filterBuilder(existing, updated) {
    const newFilter = existing.concat(updated);
    return newFilter;
  }
  function OnCloseDrillDown() {
    setShowDrillDown(false);
  }
  function OpenDrillDown(rec) {
    setShowDrillDown(true);
    setRow(rec);
  }
  return (
    <>
      <DrillDown
        visible={showDrillDown}
        onClose={OnCloseDrillDown}
        row={row}
        dates={changedDateRange.length !== 0 ? changedDateRange : dates}
      />
      <div className="row inner-top-search">
        <Filter
          filters={[
            firstLevel,
            filterBuilder(filter, [
              {
                className: "col-2 formgroup finCusCheckBox",
                type: "CH",
                data: "Non Zero amount",
                checkText: "Yes",
                labelText: "Hide Zero Account",
              },
              {
                className: "col-2 formgroup finCusCheckBox",
                type: "CH",
                data: "Show Ledger Code",
                checkText: "Yes",
                labelText: "Show Ledger Code",
              },
              {
                className: "col-2 formgroup finCusCheckBox",
                type: "CH",
                data: "Arabic",
                checkText: "Yes",
                labelText: "Show Account Name in Arabic",
              },
            ]),
          ]}
          callBack={(inputs, cb) => {
            const {
              PREVIOUSRANGE,
              RANGE,
              BASEDON,
              LEVELS,
              NONZEROAMOUNT,
              ARABIC,
              SHOWLEDGERCODE,
            } = inputs;
            setRangeDate(RANGE);
            setPrevDateRange(PREVIOUSRANGE);
            setChangeInPercentage(inputs["CHANGEIN%"]);
            setChangeInAccount(inputs["CHANGEINAMT."]);
            setBasedOn(BASEDON);
            setChangedDateRange([]);
            setStopLoading(cb);
            setLevels(LEVELS);
            setArabic(ARABIC === "Y" ? true : false);
            setShowLedgerCode(SHOWLEDGERCODE === "Y" ? true : false);
            setNonZero(NONZEROAMOUNT === "Y" ? true : false);
            setPreview((result) => {
              return result === undefined ? false : !result;
            });
          }}
          triggerUpdate={triggerUpdate}
        />
      </div>

      <ReportLayout
        dates={rangeDate}
        showArabic={showArabic}
        title={`${type === "pandl" ? "Profit and Loss" : "Balance Sheet"}  ${
          reportType === "comparison" ? "Comparison" : ""
        }`}
        columns={preview === undefined ? [] : columns}
        data={preview === undefined ? [] : data}
        tableprops={tableProps}
        // layout={layout}
        // excelBodyRender={(row, callBack) => {
        //   if (row.leafnode === "Y") {
        //     callBack(row);
        //   }
        // }}
      />
    </>
  );
}
