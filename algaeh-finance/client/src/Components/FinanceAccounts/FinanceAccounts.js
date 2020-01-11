import React from "react";
// import JournalVoucher from "../JournalVoucher";
import TreeComponent from "./TreeComponent";
// import ReactDom from "react-dom";
import { AlgaehTabs, AlgaehLabel } from "algaeh-react-components";
export default function FinanceAccounts({ inDrawer = false }) {
  return (
    <div className="">
      <AlgaehTabs
        content={[
          {
            title: (
              <AlgaehLabel
                label={{
                  forceLabel: "Assets"
                }}
              />
            ),
            children: (
              <TreeComponent
                assetCode={"1"}
                title="Assets Accounts"
                inDrawer={inDrawer}
              />
            )
          },
          {
            title: (
              <AlgaehLabel
                label={{
                  forceLabel: "Liabilities"
                }}
              />
            ),
            children: (
              <TreeComponent
                assetCode={"2"}
                title="Liability Accounts"
                inDrawer={inDrawer}
              />
            )
          },
          {
            title: (
              <AlgaehLabel
                label={{
                  forceLabel: "Income"
                }}
              />
            ),
            children: (
              <TreeComponent
                assetCode={"4"}
                title="Income Accounts"
                inDrawer={inDrawer}
              />
            )
          },
          {
            title: (
              <AlgaehLabel
                label={{
                  forceLabel: "Capital"
                }}
              />
            ),
            children: (
              <TreeComponent
                assetCode={"3"}
                title="Capital Accounts"
                inDrawer={inDrawer}
              />
            )
          },
          {
            title: (
              <AlgaehLabel
                label={{
                  fieldName: "Expense"
                }}
              />
            ),
            children: (
              <TreeComponent
                assetCode={"5"}
                title="Expense Accounts"
                inDrawer={inDrawer}
              />
            )
          }
        ]}
        // component={
        //   back !== undefined && back === "journalVoucher" ? (
        //     <AlgaehButton
        //       type="danger"
        //       shape="circle"
        //       icon="arrow-right"
        //       onClick={() => {
        //         ReactDom.render(
        //           <JournalVoucher />,
        //           document.getElementById("hisapp")
        //         );
        //       }}
        //     />
        //   ) : null
        // }
      />
    </div>
  );
}

//dead code

// const previousContent = [
//   {
//     title: (
//       <AlgaehLabel
//         label={{
//           forceLabel: "Assets"
//         }}
//       />
//     ),
//     children: <Assets />
//   },
//   {
//     title: (
//       <AlgaehLabel
//         label={{
//           forceLabel: "Liabilities"
//         }}
//       />
//     ),
//     children: <Liabilities />
//   },
//   {
//     title: (
//       <AlgaehLabel
//         label={{
//           forceLabel: "Income"
//         }}
//       />
//     ),
//     children: <Income />
//   },
//   {
//     title: (
//       <AlgaehLabel
//         label={{
//           forceLabel: "Capital"
//         }}
//       />
//     ),
//     children: <Capital />
//   },
//   {
//     title: (
//       <AlgaehLabel
//         label={{
//           fieldName: "Expense"
//         }}
//       />
//     ),
//     children: <Expense />
//   }
// ];
