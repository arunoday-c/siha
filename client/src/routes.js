import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  HashRouter,
  ReactRouter
} from "react-router-dom";

import FrontDesk from "./Components/RegistrationPatient/RegistrationPatient.js";
import Login from "./Components/Login/Login.js";
import Dashboard from "./Components/Dashboard/Dashboard.js";
import DeptMaster from "./Components/BusinessSetup/DeptMaster/DeptMaster.js";
import BusinessSetup from "./Components/BusinessSetup/BusinessSetup.js";
import CommonSetup from "./Components/CommonSetup/CommonSetup.js";
import Experiment from "./Components/Experiment.js";

function height() {
  let height =
    window.innerHeight * (window.innerHeight / document.body.offsetHeight);

  return height;
}
const appRoutes = [
  {
    path: "/",
    isExactPath: true,
    component: <Login />
  },
  {
    path: "/FrontDesk",
    isExactPath: true,
    component: <FrontDesk />
  },
  {
    path: "/BusinessSetup",
    isExactPath: true,
    component: <BusinessSetup />
  },
  {
    path: "/CommonSetup",
    isExactPath: true,
    component: <CommonSetup />
  },
  {
    path: "/Experiment",
    isExactPath: true,
    component: <Experiment />
  },
  {
    path: "/Dashboard",
    isExactPath: true,
    component: <Dashboard />
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
