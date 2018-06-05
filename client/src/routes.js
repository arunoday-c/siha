import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  HashRouter,
  ReactRouter
} from "react-router-dom";

import FrontDesk from "./Components/RegistrationPatient/RegistrationPatient";
import Login from "./Components/Login/Login";
import Dashboard from "./Components/Dashboard/Dashboard";
import DeptMaster from "./Components/BusinessSetup/DeptMaster/DeptMaster";
import BusinessSetup from "./Components/BusinessSetup/BusinessSetup";
import CommonSetup from "./Components/CommonSetup/CommonSetup";
import Experiment from "./Components/Experiment";
import AlgaehMainpg from "./Components/common/AlgaehmainPage/AlgaehmainPage";

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
    path: "/Home",
    isExactPath: true,
    component: <AlgaehMainpg />
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

