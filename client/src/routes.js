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
import InsuranceSetup from "./Components/InsuranceSetup/InsuranceSetup.js";
import BusinessSetup from "./Components/BusinessSetup/BusinessSetup";
import CommonSetup from "./Components/CommonSetup/CommonSetup";
import Experiment from "./Components/Experiment";
import AlgaehMainpg from "./Components/common/AlgaehmainPage/AlgaehmainPage";
import DoctorsWorkbench from "./Components/DoctorsWorkbench/DoctorsWorkbench";
import PatientProfile from "./Components/PatientProfile/PatientProfile";
import Plan from "./Components/PatientProfile/Plan/Plan";
import Workbench from "./Components/Workbench/Workbench";
import RadioDay from "./Components/Radiology/RadResultEntry/RadResultEntry";

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
  },
  {
    path: "/InsuranceSetup",
    isExactPath: true,
    component: <InsuranceSetup />
  },
  {
    path: "/DW",
    isExactPath: true,
    component: <DoctorsWorkbench />
  },
  {
    path: "/PP",
    isExactPath: true,
    component: <PatientProfile />
  },
  {
    path: "/plan",
    isExactPath: true,
    component: <Plan />
  },
  {
    path: "/RD",
    isExactPath: true,
    component: <RadioDay />
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
