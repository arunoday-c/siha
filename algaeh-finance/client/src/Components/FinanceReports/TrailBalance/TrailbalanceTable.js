import React, { useState, useEffect } from "react";
import PrintLayout from "../printlayout";
import DrillDown from "../drillDown";
import _ from "lodash";
import { getAmountFormart } from "../../../utils/GlobalFunctions";
export default function TrailBalaceReport({
  style,
  data,
  nonZero = "N",
  layout,
  dates,
  showArabic,
  showLedgerCode,
  levels = "ALL",
  showLastrecord,
  // createPrintObject,
}) {
  const { asset, expense, liability, capital, income, final_child } = data;
  const [showDrillDown, setShowDrillDown] = useState(false);
  const [row, setRow] = useState(undefined);
  const [columns, setColumns] = useState([]);
  useEffect(() => {
    if (showLedgerCode) {
      setColumns([
        {
          fieldName: "ledger_code",
          label: "Ledger Code",
          filterable: true,
          freezable: true,
        },
        {
          fieldName: showArabic ? "arabic_name" : "label",
          label: "Particulars",
          filterable: true,
          freezable: true,
        },

        {
          fieldName: "op_amount",
          label: "Opening Balance",
          // displayTemplate: (row) => {
          //   const opamt = String(row["op_amount"]).replace(/[^0-9./]+/g, "");

          //   if (!isNaN(opamt)) {
          //     return (
          //       getAmountFormart(parseFloat(opamt), { appendSymbol: false }) +
          //       " " +
          //       String(row["op_amount"]).replace(/[^a-zA-Z]+/g, "")
          //     );
          //   }
          //   return row["op_amount"];
          // },
        },
        {
          fieldName: "tr_debit_amount",
          label: "Transactions Debit",
          displayTemplate: (row) => {
            return getAmountFormart(row["tr_debit_amount"], {
              appendSymbol: false,
            });
          },
        },
        {
          fieldName: "tr_credit_amount",
          label: "Transaction Credit",
          displayTemplate: (row) => {
            return getAmountFormart(row["tr_credit_amount"], {
              appendSymbol: false,
            });
          },
        },
        {
          fieldName: "cb_amount",
          label: "Closing Balance",
          displayTemplate: (row) => {
            const opamt = String(row["cb_amount"]).trim(); //.replace(/[^0-9./]+/g, "");

            // if (!isNaN(parseFloat(opamt)) && row.leafNode === "Y") {
            if (row.leafNode === "Y") {
              return (
                <a
                  className="underLine"
                  href="void(0);"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("row", row);
                    OpenDrillDown(row);
                  }}
                >
                  {String(row["cb_amount"]).trim()}
                  {/* {getAmountFormart(parseFloat(opamt), {
                    appendSymbol: false,
                  }) +
                    " " +
                    String(row["cb_amount"]).replace(/[^a-zA-Z]+/g, "")} */}
                </a>
              );
            }
            return row["cb_amount"];
          },
        },
      ]);
    } else {
      setColumns([
        {
          fieldName: showArabic ? "arabic_name" : "label",
          label: "Particulars",
          filterable: true,
          freezable: true,
        },

        {
          fieldName: "op_amount",
          label: "Opening Balance",
        },
        {
          fieldName: "tr_debit_amount",
          label: "Transactions Debit",
          displayTemplate: (row) => {
            return getAmountFormart(row["tr_debit_amount"], {
              appendSymbol: false,
            });
          },
        },
        {
          fieldName: "tr_credit_amount",
          label: "Transaction Credit",
          displayTemplate: (row) => {
            return getAmountFormart(row["tr_credit_amount"], {
              appendSymbol: false,
            });
          },
        },
        {
          fieldName: "cb_amount",
          label: "Closing Balance",
          displayTemplate: (row) => {
            const opamt = String(row["cb_amount"]).trim();

            // if (!isNaN(parseFloat(opamt)) && row.leafnode === "Y") {
            if (row.leafNode === "Y") {
              return (
                <a
                  className="underLine"
                  href="void(0);"
                  onClick={(e) => {
                    e.preventDefault();
                    OpenDrillDown(row);
                  }}
                >
                  {String(row["cb_amount"]).trim()}
                  {/* {getAmountFormart(parseFloat(opamt), {
                    appendSymbol: false,
                  })} */}
                </a>
              );
            }
            return row["cb_amount"];
          },
        },
      ]);
    }
  }, [showLedgerCode, showArabic]);
  let accounts = [];
  debugger;
  if (showLastrecord === "Y") {
    accounts = final_child;
  } else {
    if (asset) {
      accounts.push(asset);
    }
    if (expense) {
      accounts.push(expense);
    }
    if (liability) {
      accounts.push(liability);
    }
    if (capital) {
      accounts.push(capital);
    }
    if (income) {
      accounts.push(income);
    }
  }
  function OpenDrillDown(rec) {
    setShowDrillDown(true);
    setRow(rec);
  }
  function OnCloseDrillDown() {
    setShowDrillDown(false);
  }

  return (
    <>
      <DrillDown
        visible={showDrillDown}
        onClose={OnCloseDrillDown}
        row={row}
        dates={dates}
      />

      <PrintLayout
        title="Trial Balance"
        dates={dates}
        showArabic={showArabic}
        columns={columns}
        data={accounts || []}
        layout={layout}
        tableprops={{
          conditionalPlot: (row) => {
            if (nonZero === "Y") {
              const { op_amount, tr_credit_amount, tr_debit_amount } = row;
              if (
                parseFloat(op_amount) === 0 &&
                parseFloat(tr_credit_amount) === 0 &&
                parseFloat(tr_debit_amount) === 0
              ) {
                return false;
              } else {
                return true;
              }
            }
            if (levels !== "ALL") {
              const { account_level } = row;
              if (account_level <= parseInt(levels, 10)) {
                return true;
              } else {
                return false;
              }
            }
            return true;
          },
          aggregate: (field) => {
            if (field === "tr_debit_amount" || field === "tr_credit_amount") {
              const val = _.sumBy(accounts, (f) => parseFloat(f[field]));
              return getAmountFormart(parseFloat(val), { appendSymbol: false });
            } else {
              return null;
            }
          },
          footer: true,
        }}
      />
    </>
  );
}
