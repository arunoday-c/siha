import React from "react";
import Assets from "./Assets";
import Liabilities from "./Liabilities";
import Income from "./Income";
import Capital from "./Capital";
import Expense from "./Expense";
import JournalVoucher from "../JournalVoucher";
import ReactDom from "react-dom";
import { AlgaehTabs, AlgaehLabel, AlgaehButton } from "algaeh-react-components";
export default function FinanceAccounts(props) {
  const { back } = props;
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
            children: <Assets />
          },
          {
            title: (
              <AlgaehLabel
                label={{
                  forceLabel: "Liabilities"
                }}
              />
            ),
            children: <Liabilities />
          },
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
                  forceLabel: "Capital"
                }}
              />
            ),
            children: <Capital />
          },
          {
            title: (
              <AlgaehLabel
                label={{
                  fieldName: "Expense"
                }}
              />
            ),
            children: <Expense />
          }
        ]}
        component={
          back !== undefined && back === "journalVoucher" ? (
            <AlgaehButton
              type="danger"
              shape="circle"
              icon="arrow-right"
              onClick={() => {
                ReactDom.render(
                  <JournalVoucher />,
                  document.getElementById("hisapp")
                );
              }}
            />
          ) : null
        }
      />
    </div>
  );
}
