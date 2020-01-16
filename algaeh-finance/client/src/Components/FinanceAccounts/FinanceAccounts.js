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

// Old Tab config
// [
//   {
//     title: (
//       <AlgaehLabel
//         label={{
//           forceLabel: "Assets"
//         }}
//       />
//     ),
//     children: (
//       <TreeComponent
//         assetCode={"1"}
//         title="Assets Accounts"
//         inDrawer={inDrawer}
//       />
//     )
//   },
//   {
//     title: (
//       <AlgaehLabel
//         label={{
//           forceLabel: "Liabilities"
//         }}
//       />
//     ),
//     children: (
//       <TreeComponent
//         assetCode={"2"}
//         title="Liability Accounts"
//         inDrawer={inDrawer}
//       />
//     )
//   },
//   {
//     title: (
//       <AlgaehLabel
//         label={{
//           forceLabel: "Income"
//         }}
//       />
//     ),
//     children: (
//       <TreeComponent
//         assetCode={"4"}
//         title="Income Accounts"
//         inDrawer={inDrawer}
//       />
//     )
//   },
//   {
//     title: (
//       <AlgaehLabel
//         label={{
//           forceLabel: "Capital"
//         }}
//       />
//     ),
//     children: (
//       <TreeComponent
//         assetCode={"3"}
//         title="Capital Accounts"
//         inDrawer={inDrawer}
//       />
//     )
//   },
//   {
//     title: (
//       <AlgaehLabel
//         label={{
//           fieldName: "Expense"
//         }}
//       />
//     ),
//     children: (
//       <TreeComponent
//         assetCode={"5"}
//         title="Expense Accounts"
//         inDrawer={inDrawer}
//       />
//     )
//   }
// ]
