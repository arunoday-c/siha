import React, { useState } from "react";
// import { AlgaehLabel } from "../../Wrappers";
import Expense from "./Expense";
import Income from "./Income";
import Transfer from "./Transfer";
import { AlgaehTabs, AlgaehLabel } from "algaeh-react-components";

export default function Transactions() {
  return (
    <AlgaehTabs
      content={[
        {
          title: (
            <AlgaehLabel
              label={{
                forceLabel: "Income"
              }}
            />
          ),
          children: <Income />
        },
        {
          title: (
            <AlgaehLabel
              label={{
                forceLabel: "Expense"
              }}
            />
          ),
          children: <Expense />
        },
        {
          title: (
            <AlgaehLabel
              label={{
                forceLabel: "Transfer"
              }}
            />
          ),
          children: <Transfer />
        }
      ]}
    />
  );
}
