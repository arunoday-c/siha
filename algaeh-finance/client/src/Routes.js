import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
const Home = lazy(() => import("./App"));
const Accounts = lazy(() => import("./Components/FinanceAccounts"));

export default function Routes(props) {
  return (
    <Router>
      <Switch>
        <Suspense fallback={<div>Loading...</div>}>
          <Route path="/" component={Home} />
          <Route path="/accounts" component={Accounts} />
        </Suspense>
      </Switch>
    </Router>
  );
}
