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
import OrderingServices from "./Components/DoctorsWorkbench/OrderingServices/OrderingServices";
import PreApproval from "./Components/PreApproval/PreApproval";
import LabSetup from "./Components/LabSetup/LabSetup";

function height() {
  let height =
    window.innerHeight * (window.innerHeight / document.body.offsetHeight);
  return height;
}

const componts = (selectedLang, breadStyle) => {
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
    InsuranceSetup: (
      <InsuranceSetup SelectLanguage={selectedLang} breadStyle={breadStyle} />
    ),
    SampleCollection: (
      <SampleCollection SelectLanguage={selectedLang} breadStyle={breadStyle} />
    ),
    DoctorsWorkbench: (
      <DoctorsWorkbench SelectLanguage={selectedLang} breadStyle={breadStyle} />
    ),
    MedicalWorkbenchSetup: (
      <MedicalWorkbenchSetup
        SelectLanguage={selectedLang}
        breadStyle={breadStyle}
      />
    ),
    AccessionAcknowledgement: (
      <AccessionAcknowledgement
        SelectLanguage={selectedLang}
        breadStyle={breadStyle}
      />
    ),

    OrderingServices: (
      <OrderingServices SelectLanguage={selectedLang} breadStyle={breadStyle} />
    ),
    PreApproval: (
      <PreApproval SelectLanguage={selectedLang} breadStyle={breadStyle} />
    ),
    LabSetup: <LabSetup SelectLanguage={selectedLang} breadStyle={breadStyle} />
  };
};

const directRoutes = (componet, selectedLang, breadStyle) => {
  const MyComponet = componts(selectedLang, breadStyle)[componet];
  return MyComponet;
};

export default directRoutes;
