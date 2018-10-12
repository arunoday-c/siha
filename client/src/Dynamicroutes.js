import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  HashRouter,
  ReactRouter
} from "react-router-dom";
import AlgaehLoader from "./Components/Wrapper/fullPageLoader";
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
import Workbench from "./Components/Workbench/Workbench";
import OrderingServices from "./Components/DoctorsWorkbench/OrderingServices/OrderingServices";
import AccessionAcknowledgement from "./Components/Laboratory/AccessionAcknowledgement/AccessionAcknowledgement";

import PreApproval from "./Components/PreApproval/PreApproval";
import LabSetup from "./Components/LabSetup/LabSetup";
import InvestigationSetup from "./Components/InvestigationSetup/InvestigationSetup";
import RadOrderedList from "./Components/Radiology/RadOrderedList/RadOrderedList";

import RadScheduledList from "./Components/Radiology/RadScheduledList/RadScheduledList";
import ResultEntryList from "./Components/Laboratory/ResultEntryList/ResultEntryList";
import InitialStock from "./Components/Pharmacy/InitialStock/InitialStock";
import PrescriptionList from "./Components/Pharmacy/PrescriptionList/PrescriptionList";
import Appointment from "./Components/Appointment/Appointment";
import PharmacySetup from "./Components/PharmacySetup/PharmacySetup";
import StockEnquiry from "./Components/Pharmacy/StockEnquiry/StockEnquiry";
import ItemMomentEnquiry from "./Components/Pharmacy/ItemMomentEnquiry/ItemMomentEnquiry";
import AppointmentSetup from "./Components/AppointmentSetup/AppointmentSetup";
import ItemSetup from "./Components/ItemSetup/ItemSetup";
import EmployeeMasterIndex from "./Components/EmployeeManagement/EmployeeMasterIndex/EmployeeMasterIndex";
import PhysicianScheduleSetup from "./Components/PhysicianScheduleSetup/PhysicianScheduleSetup";
import FrontDeskAr from "./Components/RegistrationPatientAr/RegistrationPatientAr";
import OPBillingAr from "./Components/OPBillingAr/OPBillingAr";
import DoctorCommission from "./Components/DoctorCommission/DoctorCommission";
import HospitalServiceSetup from "./Components/HospitalServiceSetup/HospitalServiceSetup";
import PointOfSale from "./Components/Pharmacy/PointOfSale/PointOfSale";
import OPBillPendingList from "./Components/OPBillPendingList/OPBillPendingList";
import Mrd from "./Components/MRD/MRD";
import SalesReturn from "./Components/Pharmacy/SalesReturn/SalesReturn";
import RequisitionEntry from "./Components/Pharmacy/RequisitionEntry/RequisitionEntry";

// function height() {
//   let height =
//     window.innerHeight * (window.innerHeight / document.body.offsetHeight);
//   return height;
// }

const componts = (selectedLang, breadStyle) => {
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
    DoctorsWorkbench: <Workbench SelectLanguage={selectedLang} />,
    NurseWorkbench: <Workbench SelectLanguage={selectedLang} />,
    OrderingServices: <OrderingServices SelectLanguage={selectedLang} />,

    MedicalWorkbenchSetup: (
      <MedicalWorkbenchSetup SelectLanguage={selectedLang} />
    ),
    AccessionAcknowledgement: (
      <AccessionAcknowledgement SelectLanguage={selectedLang} />
    ),

    PreApproval: <PreApproval SelectLanguage={selectedLang} />,
    LabSetup: <LabSetup SelectLanguage={selectedLang} />,
    InvestigationSetup: <InvestigationSetup SelectLanguage={selectedLang} />,
    RadOrderedList: <RadOrderedList SelectLanguage={selectedLang} />,
    RadScheduledList: <RadScheduledList SelectLanguage={selectedLang} />,
    ResultEntryList: <ResultEntryList SelectLanguage={selectedLang} />,
    InitialStock: <InitialStock SelectLanguage={selectedLang} />,
    PrescriptionList: <PrescriptionList SelectLanguage={selectedLang} />,
    Appointment: <Appointment SelectLanguage={selectedLang} />,
    PharmacySetup: <PharmacySetup SelectLanguage={selectedLang} />,
    StockEnquiry: <StockEnquiry SelectLanguage={selectedLang} />,
    ItemMomentEnquiry: <ItemMomentEnquiry SelectLanguage={selectedLang} />,
    AppointmentSetup: <AppointmentSetup SelectLanguage={selectedLang} />,
    ItemSetup: <ItemSetup SelectLanguage={selectedLang} />,
    EmployeeMasterIndex: <EmployeeMasterIndex SelectLanguage={selectedLang} />,
    PhysicianScheduleSetup: (
      <PhysicianScheduleSetup SelectLanguage={selectedLang} />
    ),
    FrontDeskAr: <FrontDeskAr SelectLanguage={selectedLang} />,
    OPBillingAr: <OPBillingAr SelectLanguage={selectedLang} />,
    DoctorCommission: <DoctorCommission SelectLanguage={selectedLang} />,
    HospitalServiceSetup: (
      <HospitalServiceSetup SelectLanguage={selectedLang} />
    ),
    PointOfSale: <PointOfSale SelectLanguage={selectedLang} />,
    OPBillPendingList: <OPBillPendingList SelectLanguage={selectedLang} />,
    MRDList: <Mrd SelectLanguage={selectedLang} />,
    SalesReturn: <SalesReturn SelectLanguage={selectedLang} />,
    RequisitionEntry: <RequisitionEntry SelectLanguage={selectedLang} />
  };
};

const directRoutes = (componet, selectedLang, breadStyle) => {
  const MyComponet = componts(selectedLang, breadStyle)[componet];
  AlgaehLoader({ show: false });
  return MyComponet;
};

export default directRoutes;
