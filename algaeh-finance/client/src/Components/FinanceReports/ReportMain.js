import React from "react";
import Balance from "./FinanceStandardReports/balancesheet";
// import TrailBalance from "./FinanceStandardReports/trailbalance";
import TrailBalance from "./TrailBalance";
import AgingReport from "./FinanceStandardReports/AgingReport";
import PnLReport from "./PnLReport";

export default function ReportMain({
  selected,
  data,
  dates,
  layout,
  finOptions,
  organization
}) {
  switch (selected) {
    case "BS":
      return <Balance layout={layout} dates={dates} />;
    case "PL":
      return (
        <PnLReport
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

    default:
      return null;
  }
}

// case "PL":
//   return (
//     <Balance
//       data={data}
//       layout={layout}
//       result={["income", "expense"]}
//       footer={result => <div>Profit : {result.profit}</div>}
//     />
//   );
// case "PLCost":
//   return <PandLCostCenter />;
// case "PLYear":
//   return (
//     <PLYear
//       default_branch_id={finOptions.default_branch_id}
//       default_cost_center_id={finOptions.default_cost_center_id}
//       organization={organization}
//     />
// );
