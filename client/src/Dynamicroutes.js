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

const componts =(selectedLang)=>{return{
  Dashboard: <Dashboard SelectLanguage ={selectedLang} />,
  FrontDesk:<FrontDesk SelectLanguage ={selectedLang} />,
  BusinessSetup:<BusinessSetup SelectLanguage ={selectedLang} />,
  CommonSetup:<CommonSetup SelectLanguage ={selectedLang} />,
  Experiment:<Experiment SelectLanguage ={selectedLang} />
}}

const directRoutes = ((componet, selectedLang)=>{
    debugger;
    const  MyComponet = componts(selectedLang)[componet];
    return(MyComponet);
});

export default directRoutes;

