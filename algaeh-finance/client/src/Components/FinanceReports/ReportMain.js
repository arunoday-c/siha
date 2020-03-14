import React from "react";
import Balance from "./FinanceStandardReports/balancesheet";
import TrailBalance from "./FinanceStandardReports/trailbalance";
import AgingReport from "./FinanceStandardReports/AgingReport";
import PnLReport from "./PnLReport";

export default function ReportMain({
  selected,
  data,
  layout,
  finOptions,
  organization
}) {
  switch (selected) {
    case "BS":
      return (
        <Balance
          data={data}
          layout={layout}
          result={["asset", "liabilities"]}
        />
      );
    case "PL":
      return (
        <PnLReport
          layout={layout}
          finOptions={finOptions}
          organization={organization}
        />
      );
    case "TB":
      return <TrailBalance layout={layout} data={data} />;
    case "AR":
      return <AgingReport layout={layout} type="receivable" />;
    case "AP":
      return <AgingReport layout={layout} type="payable" />;

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
