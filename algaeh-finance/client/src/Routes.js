import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
const Home = lazy(() => import("./App"));
const Accounts = lazy(() => import("./Components/FinanceAccounts"));
const Reports = lazy(() => import("./Components/FinanceReports"));
const Transactions = lazy(() => import("./Components/Transactions"));
const JournalVoucher = lazy(() => import("./Components/JournalVoucher"));
const FinanceOptions = lazy(() => import("./Components/FinanceOptions"));
const CostCenter = lazy(() => import("./Components/CostCenterPage"));
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
          <Route
            path="/JournalAuthorization"
            component={JournalAuthorization}
          />
        </Suspense>
      </Switch>
    </Router>
  );
}
