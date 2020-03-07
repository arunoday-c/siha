import React from "react";
import ReportLauncher from "../FinanceAccounts/AccountReport";

export default function LedgerReport({ visible, setVisible, data }) {
  return (
    <ReportLauncher
      title="Ledger Report"
      fromInvoice={true}
      visible={visible}
      selectedNode={data}
      onCancel={() => {
        setVisible(false);
      }}
      onOk={() => {
        setVisible(false);
      }}
    />
  );
}

//date wise leaf node
