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
import SampleCollection from "./Components/Laboratory/SampleCollection/SampleCollection";
import MedicalWorkbenchSetup from "./Components/MedicalWorkbenchSetup/MedicalWorkbenchSetup";
import DoctorsWorkbench from "./Components/DoctorsWorkbench/DoctorsWorkbench";
import AccessionAcknowledgement from "./Components/Laboratory/AccessionAcknowledgement/AccessionAcknowledgement";
function height() {
  let height =
    window.innerHeight * (window.innerHeight / document.body.offsetHeight);
  return height;
}

const componts = selectedLang => {
  return {
    Dashboard: <Dashboard SelectLanguage={selectedLang} />,
    FrontDesk: <FrontDesk SelectLanguage={selectedLang} />,
    BusinessSetup: <BusinessSetup SelectLanguage={selectedLang} />,
    CommonSetup: <CommonSetup SelectLanguage={selectedLang} />,
    Experiment: <Experiment SelectLanguage={selectedLang} />,
    OPBilling: <OPBilling SelectLanguage={selectedLang} />,
    BillDetails: <BillDetails SelectLanguage={selectedLang} />,
    InsuranceSetup: <InsuranceSetup SelectLanguage={selectedLang} />,
    SampleCollection: <SampleCollection SelectLanguage={selectedLang} />,
    DoctorsWorkbench: <DoctorsWorkbench SelectLanguage={selectedLang} />,
    MedicalWorkbenchSetup: (
      <MedicalWorkbenchSetup SelectLanguage={selectedLang} />
    ),
    AccessionAcknowledgement: (
      <AccessionAcknowledgement SelectLanguage={selectedLang} />
    )
  };
};

const directRoutes = (componet, selectedLang) => {
  const MyComponet = componts(selectedLang)[componet];
  return MyComponet;
};

export default directRoutes;
