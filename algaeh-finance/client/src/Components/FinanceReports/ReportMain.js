import React from "react";
import Balance from "./FinanceStandardReports/balancesheet";
// import TrailBalance from "./FinanceStandardReports/trailbalance";
import TrailBalance from "./TrailBalance";
import AgingReport from "./FinanceStandardReports/AgingReport";
import PnLReport from "./PnLReport";
import { Cashflow } from "./Cashflow";

export default function ReportMain({
  selectedFilter,
  selected,
  dates,
  layout,
  finOptions,
  organization,
}) {
  switch (selected) {
    case "BS":
      return (
        <Balance
          selectedFilter={selectedFilter}
          layout={layout}
          dates={dates}
        />
      );
    case "PL":
      return (
        <PnLReport
          selectedFilter={selectedFilter}
          layout={layout}
          finOptions={finOptions}
          organization={organization}
        />
      );
    case "TB":
      return (
        <TrailBalance layout={layout} dates={dates} finOptions={finOptions} />
      );
    case "AR":
      return <AgingReport layout={layout} type="receivable" dates={dates} />;
    case "AP":
      return <AgingReport layout={layout} type="payable" dates={dates} />;
    case "CF":
      return <Cashflow layout={layout} dates={dates} />;

    default:
      return <h1>No Report Linked</h1>;
  }
}
