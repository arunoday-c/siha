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
import Dashboard from "./Components/Dashboard/Dashboard";
import BusinessSetup from "./Components/BusinessSetup/BusinessSetup";
import CommonSetup from "./Components/CommonSetup/CommonSetup";
import Experiment from "./Components/Experiment";
import OPBilling from "./Components/OPBilling/OPBilling";
import BillDetails from "./Components/BillDetails/BillDetails";
import InsuranceSetup from "./Components/InsuranceSetup/InsuranceSetup";

function height() {
  let height =
    window.innerHeight * (window.innerHeight / document.body.offsetHeight);
  return height;
}

const componts = (selectedLang, breadStyle) => {
  debugger;
  return {
    Dashboard: <Dashboard SelectLanguage={selectedLang} />,
    FrontDesk: (
      <FrontDesk SelectLanguage={selectedLang} breadStyle={breadStyle} />
    ),
    BusinessSetup: (
      <BusinessSetup SelectLanguage={selectedLang} breadStyle={breadStyle} />
    ),
    CommonSetup: (
      <CommonSetup SelectLanguage={selectedLang} breadStyle={breadStyle} />
    ),
    Experiment: <Experiment SelectLanguage={selectedLang} />,
    OPBilling: (
      <OPBilling SelectLanguage={selectedLang} breadStyle={breadStyle} />
    ),
    BillDetails: <BillDetails SelectLanguage={selectedLang} />,
    InsuranceSetup: <InsuranceSetup SelectLanguage={selectedLang} />
  };
};

const directRoutes = (componet, selectedLang, breadStyle) => {
  const MyComponet = componts(selectedLang, breadStyle)[componet];
  return MyComponet;
};

export default directRoutes;
