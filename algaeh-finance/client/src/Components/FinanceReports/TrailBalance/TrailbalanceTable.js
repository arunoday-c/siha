import React, { useState } from "react";
import PrintLayout from "../printlayout";
import DrillDown from "../drillDown";
import { getAmountFormart } from "../../../utils/GlobalFunctions";
export default function TrailBalaceReport({
  style,
  data,
  nonZero = true,
  layout,
  dates,
  // createPrintObject,
}) {
  const { asset, expense, liability, capital, income } = data;
  const [showDrillDown, setShowDrillDown] = useState(false);
  const [row, setRow] = useState(undefined);
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
        columns={[
          {
            fieldName: "label",
            label: "Paticulars",
            filterable: true,
            freezable: true,
          },
          { fieldName: "arabic_name", label: "Arabic Name" },
          {
            fieldName: "op_amount",
            label: "Opening Balance",
            displayTemplate: (row) => {
              const opamt = String(row["op_amount"]).replace(/[^0-9]+/g, "");

              if (!isNaN(opamt)) {
                return (
                  getAmountFormart(parseFloat(opamt), { appendSymbol: false }) +
                  " " +
                  String(row["op_amount"]).replace(/[^a-zA-Z]+/g, "")
                );
              }
              return row["op_amount"];
            },
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
              const opamt = String(row["cb_amount"]).replace(/[^0-9]+/g, "");

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
        ]}
        data={accounts || []}
        layout={layout}
      />
    </>
  );
}
