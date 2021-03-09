import React from "react";
import TreeComponent from "./TreeComponent";
import { AlgaehTabs, AlgaehLabel } from "algaeh-react-components";
export default function FinanceAccounts({ inDrawer = false }) {
  const TABS = [
    { label: "assets", assetCode: 1 },
    { label: "liabilities", assetCode: 2 },
    { label: "income", assetCode: 4 },
    { label: "capital", assetCode: 3 },
    { label: "expense", assetCode: 5 },
  ];

  const content = TABS.map((tab) => {
    return {
      title: (
        <AlgaehLabel
          label={{
            fieldName: tab.label,
          }}
        />
      ),
      children: (
        <TreeComponent
          assetCode={tab.assetCode}
          title={`${tab.label} Accounts`}
          inDrawer={inDrawer}
        />
      ),
    };
  });

  return (
    <div className="">
      <AlgaehTabs content={content} />
    </div>
  );
}
