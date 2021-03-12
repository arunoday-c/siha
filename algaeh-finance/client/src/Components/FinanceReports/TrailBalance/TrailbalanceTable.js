import React, { useState, useEffect } from "react";
import PrintLayout from "../printlayout";
import DrillDown from "../drillDown";
import _ from "lodash";
import { getAmountFormart } from "../../../utils/GlobalFunctions";
export default function TrailBalaceReport({
  style,
  data,
  nonZero = true,
  layout,
  dates,
  showArabic,
  showLedgerCode,
  // createPrintObject,
}) {
  const { asset, expense, liability, capital, income } = data;
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
          label: "Paticulars",
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
            const opamt = String(row["cb_amount"]).replace(/[^0-9./]+/g, "");

            if (!isNaN(opamt) && row.leafnode === "Y") {
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
                  {getAmountFormart(parseFloat(opamt), {
                    appendSymbol: false,
                  }) +
                    " " +
                    String(row["cb_amount"]).replace(/[^a-zA-Z]+/g, "")}
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
          label: "Paticulars",
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
            const opamt = String(row["cb_amount"]).replace(/[^0-9./]+/g, "");

            if (!isNaN(opamt) && row.leafnode === "Y") {
              return (
                <a
                  className="underLine"
                  href="void(0);"
                  onClick={(e) => {
                    e.preventDefault();
                    OpenDrillDown(row);
                  }}
                >
                  {getAmountFormart(parseFloat(opamt), {
                    appendSymbol: false,
                  }) +
                    " " +
                    String(row["cb_amount"]).replace(/[^a-zA-Z]+/g, "")}
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
        title="Trail Balance"
        dates={dates}
        showArabic={showArabic}
        columns={columns}
        data={accounts || []}
        layout={layout}
        tableprops={{
          aggregate: (field) => {
            if (field === "label") return null;
            const val = _.sumBy(accounts, (f) => parseFloat(f[field]));
            return getAmountFormart(parseFloat(val), { appendSymbol: false });
          },
          footer: true,
        }}
      />
    </>
  );
}
