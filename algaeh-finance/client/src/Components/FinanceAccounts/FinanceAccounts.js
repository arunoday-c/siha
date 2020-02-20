import React from "react";
import TreeComponent from "./TreeComponent";
import { AlgaehTabs, AlgaehLabel } from "algaeh-react-components";
export default function FinanceAccounts({ inDrawer = false }) {
  const TABS = [
    { label: "Assets", assetCode: 1 },
    { label: "Liabilities", assetCode: 2 },
    { label: "Income", assetCode: 4 },
    { label: "Capital", assetCode: 3 },
    { label: "Expense", assetCode: 5 }
  ];

  const content = TABS.map(tab => {
    return {
      title: (
        <AlgaehLabel
          label={{
            forceLabel: tab.label
          }}
        />
      ),
      children: (
        <TreeComponent
          assetCode={tab.assetCode}
          title={`${tab.label} Accounts`}
          inDrawer={inDrawer}
        />
      )
    };
  });

  return (
    <div className="">
      <AlgaehTabs content={content} />
    </div>
  );
}
