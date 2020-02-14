import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
const Home = lazy(() => import("./App"));
const Accounts = lazy(() => import("./Components/FinanceAccounts"));
const Reports = lazy(() => import("./Components/FinanceReports"));
const Transactions = lazy(() => import("./Components/Transactions"));
const JournalVoucher = lazy(() => import("./Components/JournalVoucher"));
const FinanceOptions = lazy(() => import("./Components/FinanceOptions"));
const CostCenter = lazy(() => import("./Components/CostCenterPage"));
const CostCenterMaster = lazy(() => import("./Components/CostCenterMaster"));
const QuickSearchFinance = lazy(() =>
  import("./Components/QuickSearchFinance")
);
const CustomerListFinance = lazy(() =>
  import("./Components/CustomerListFinance")
);
const CustomerPayment = lazy(() => import("./Components/CustomerPayment"));
const SupplierListFinance = lazy(() =>
  import("./Components/SupplierListFinance")
);
const SupplierPayment = lazy(() => import("./Components/SupplierPayment"));

const JournalAuthorization = lazy(() =>
  import("./Components/JournalAuthorization")
);

export default function Routes(props) {
  return (
    <Router>
      <Switch>
        <Suspense fallback={<div>Loading...</div>}>
          <Route path="/" component={Home} />
          <Route path="/accounts" component={Accounts} />
          <Route path="/reports" component={Reports} />
          <Route path="/transactions" component={Transactions} />
          <Route path="/journal" component={JournalVoucher} />
          <Route path="/options" component={FinanceOptions} />
          <Route path="/CostCenterModule" component={CostCenter} />
          <Route path="/CostCenterMaster" component={CostCenterMaster} />
          <Route path="/QuickSearchFinance" component={QuickSearchFinance} />
          <Route path="/CustomerListFinance" component={CustomerListFinance} />
          <Route path="/CustomerPayment" component={CustomerPayment} />
          <Route path="/SupplierListFinance" component={SupplierListFinance} />
          <Route path="/SupplierPayment" component={SupplierPayment} />
          <Route
            path="/JournalAuthorization"
            component={JournalAuthorization}
          />
        </Suspense>
      </Switch>
    </Router>
  );
}
