import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
const Home = lazy(() => import("./App"));
const Assets = lazy(() => import("./Components/Assets"));
const Capital = lazy(() => import("./Components/Capital"));
const Expense = lazy(() => import("./Components/Expense"));
const Income = lazy(() => import("./Components/Income"));
const Liability = lazy(() => import("./Components/Liability"));

export default function Routes(props) {
  return (
    <Router>
      <Switch>
        <Suspense fallback={<div>Loading...</div>}>
          <Route path="/" render={props => <Home {...props} />} />
          <Route path="/assets" component={Assets} />
          <Route path="/liability" component={Liability} />
          <Route path="/income" component={Income} />
          <Route path="/capital" component={Capital} />
          <Route path="/expense" component={Expense} />
        </Suspense>
      </Switch>
    </Router>
  );
}
