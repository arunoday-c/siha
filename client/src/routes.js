import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  HashRouter,
  ReactRouter
} from "react-router-dom";

import Login from "./Components/Login/Login";
import Experiment from "./Components/Experiment";
import ConcurrentTest from "./Components/concurrent-test";
import AlgaehMainpg from "./Components/common/AlgaehmainPage/AlgaehmainPage";

const appRoutes = [
  {
    path: "/",
    isExactPath: true,
    component: <Login />
  },

  {
    path: "/Home",
    isExactPath: true,
    component: <AlgaehMainpg />
  },
  {
    path: "/Experiment",
    isExactPath: true,
    component: <Experiment />
  },
  {
    path: "/ConcurrentTest",
    isExactPath: true,
    component: <ConcurrentTest />
  }
];

const routes = (
  <HashRouter>
    <Switch>
      {appRoutes.map((routeItem, idx) => {
        return (
          <Route
            key={routeItem.path}
            path={routeItem.path}
            exact={routeItem.isExactPath}
            render={params => {
              return routeItem.component;
            }}
          />
        );
      })}
    </Switch>
  </HashRouter>
);

export default routes;
