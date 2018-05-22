import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  HashRouter,
  ReactRouter
} from "react-router-dom";

import RegistrationPatient from "./Components/RegistrationPatient/RegistrationPatient.js";
import Login from "./Components/Login/Login.js";
import Dashboard from "./Components/Dashboard/Dashboard.js";
import DeptMaster from "./Components/BusinessSetup/DeptMaster/DeptMaster.js";
import BusinessSetup from "./Components/BusinessSetup/BusinessSetup.js";
import CommonSetup from "./Components/CommonSetup/CommonSetup.js";
import Experiment from './Components/Experiment.js';

const appRoutes = [
  {
    path: "/",
    isExactPath: true,
    component: <Login />
  },
  {
	path: "/RegistrationPatient",
    isExactPath: true,
    component: <RegistrationPatient />	
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
  }, {
    path : "/Experiment",
    isExactPath : true,
    component:<Experiment/>
  }, {
    path : "/Dashboard",
    isExactPath : true,
    component : <Dashboard />
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
