import React from "react";
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
// import OrderingServices from "./Components/DoctorsWorkbench/OrderingServices/OrderingServices";
import AccessionAcknowledgement from "./Components/Laboratory/AccessionAcknowledgement/AccessionAcknowledgement";
import AdministrationSetup from "./Components/AdministrationSetup/AdminSetup";

import PreApproval from "./Components/PreApproval/PreApproval";
import LabSetup from "./Components/LabSetup/LabSetup";
import InvestigationSetup from "./Components/InvestigationSetup/InvestigationSetup";
import RadOrderedList from "./Components/Radiology/RadOrderedList/RadOrderedList";

import RadScheduledList from "./Components/Radiology/RadScheduledList/RadScheduledList";
import ResultEntryList from "./Components/Laboratory/ResultEntryList/ResultEntryList";
import InitialStock from "./Components/Pharmacy/InitialStock/InitialStock";
import PrescriptionList from "./Components/Pharmacy/PrescriptionList/PrescriptionList";
import PharmacySetup from "./Components/PharmacySetup/PharmacySetup";
import StockEnquiry from "./Components/Pharmacy/StockEnquiry/StockEnquiry";
import ItemMomentEnquiry from "./Components/Pharmacy/ItemMomentEnquiry/ItemMomentEnquiry";
import AppointmentSetup from "./Components/AppointmentSetup/AppointmentSetup";
import ItemSetup from "./Components/ItemSetup/ItemSetup";
import EmployeeMasterIndex from "./Components/EmployeeManagement/EmployeeMasterIndex/EmployeeMasterIndex";
import PhysicianScheduleSetup from "./Components/PhysicianScheduleSetup/PhySchSetup";
import FrontDeskAr from "./Components/RegistrationPatientAr/RegistrationPatientAr";
import OPBillingAr from "./Components/OPBillingAr/OPBillingAr";
import DoctorCommission from "./Components/DoctorCommission/DoctorCommission";
import HospitalServiceSetup from "./Components/HospitalServiceSetup/HospitalServiceSetup";
import PointOfSale from "./Components/Pharmacy/PointOfSale/PointOfSale";
import OPBillPendingList from "./Components/OPBillPendingList/OPBillPendingList";
import Mrd from "./Components/MRD/MRD";
import ProcedureSetup from "./Components/ProcedureSetup/ProcedureSetup";
import SalesReturn from "./Components/Pharmacy/SalesReturn/SalesReturn";
import RequisitionEntry from "./Components/Pharmacy/RequisitionEntry/RequisitionEntry";
import TransferEntry from "./Components/Pharmacy/TransferEntry/TransferEntry";
import FrontDeskAppt from "./Components/FrontDesk/FrontDesk";
import RequisitionSwitch from "./Components/Pharmacy/RequisitionList/RequisitionSwitch";
import Reports from "./Components/Reports/Reports";
import PatientRecall from "./Components/PatientRecall/PatientRecall";

import WorkListGeneration from "./Components/InsuranceClaims/WorkListGeneration/WorkListGeneration";
import RCMWorkbench from "./Components/InsuranceClaims/RCMWorkbench/RCMWorkbench";
import StaffCashCollection from "./Components/StaffCashCollection/StaffCashCollection";
import InvoiceGeneration from "./Components/InsuranceClaims/InvoiceGeneration/InvoiceGeneration";
import InventorySetup from "./Components/InventorySetup/InventorySetup";
import InventoryItemMaster from "./Components/InventoryItemMaster/InventoryItemMaster";

import InvInitialStock from "./Components/Inventory/InvInitialStock/InvInitialStock";
import InvStockEnquiry from "./Components/Inventory/InvStockEnquiry/InvStockEnquiry";
import InvItemMomentEnquiry from "./Components/Inventory/InvItemMomentEnquiry/InvItemMomentEnquiry";
import InvRequisitionEntry from "./Components/Inventory/InvRequisitionEntry/InvRequisitionEntry";
import InvRequisitionSwitch from "./Components/Inventory/InvRequisitionList/InvRequisitionSwitch";
import InvTransferEntry from "./Components/Inventory/InvTransferEntry/InvTransferEntry";
import DeliveryNoteEntry from "./Components/Procurement/DeliveryNoteEntry/DeliveryNoteEntry";
import PurchaseOrderEntry from "./Components/Procurement/PurchaseOrderEntry/PurchaseOrderEntry";
import ReceiptEntry from "./Components/Procurement/ReceiptEntry/ReceiptEntry";
import ShipmentEntry from "./Components/Procurement/ShipmentEntry/ShipmentEntry";

import VendorSetup from "./Components/VendorSetup/VendorSetup";
import AcquisitionEntry from "./Components/AssetManagement/AcquisitionEntry/AcquisitionEntry";
import DepreciationEntry from "./Components/AssetManagement/DepreciationEntry/DepreciationEntry";
import DepreciationReversal from "./Components/AssetManagement/DepreciationReversal/DepreciationReversal";
import Disposal from "./Components/AssetManagement/Disposal/Disposal";
import PurchaseOrderList from "./Components/Procurement/PurchaseOrderList/PurchaseSwitch";
import DayEndProcess from "./Components/Finance/DayEndProcess/DayEndProcess";
import OPBillCancellation from "./Components/OPBillCancellation/OPBillCancellation";
import OPCreditSettlement from "./Components/OPCreditSettlement/OPCreditSettlement";
import POSCreditSettlement from "./Components/Pharmacy/POSCreditSettlement/POSCreditSettlement";
import Algaeh from "./Components/Algaeh/Algaeh";
import VisitClose from "./Components/VisitClose/VisitClose";
import AppointmentAr from "./Components/AppointmentAr/AppointmentAr";
import SelfService from "./Components/EmployeeManagement/SelfService/SelfService";
import AttendanceRegularization from "./Components/EmployeeManagement/AttendanceRegularization/AttendanceRegularization";
//import EmployeeGroups from "./Components/EmployeeManagement/EmployeeGroups/EmployeeGroups";
import PayrollSettings from "./Components/PayrollManagement/PayrollSettings/PayrollSettings";
import TimeSheet from "./Components/PayrollManagement/TimeSheets/TimeSheets";
import SalaryManagement from "./Components/PayrollManagement/SalaryManagement/SalaryManagement";
import HolidayMgmnt from "./Components/PayrollManagement/HolidayManagement/HolidayMgmnt";

import HRSettings from "./Components/EmployeeManagement/HRSettings/HRSettings";

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
    DoctorsWorkbench: (
      <Workbench SelectLanguage={selectedLang} type="DoctorsWorkbench" />
    ),
    NurseWorkbench: (
      <Workbench SelectLanguage={selectedLang} type="NurseWorkbench" />
    ),
    // OrderingServices: <OrderingServices SelectLanguage={selectedLang} />,

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
    Appointment: <FrontDeskAppt SelectLanguage={selectedLang} />,
    AppointmentAr: <AppointmentAr SelectLanguage={selectedLang} />,
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
    RequisitionEntry: <RequisitionEntry SelectLanguage={selectedLang} />,
    ProcedureSetup: <ProcedureSetup SelectLanguage={selectedLang} />,
    TransferEntry: <TransferEntry SelectLanguage={selectedLang} />,
    RequisitionList: <RequisitionSwitch SelectLanguage={selectedLang} />,
    ReportsList: <Reports SelectLanguage={selectedLang} />,
    WorkListGeneration: <WorkListGeneration SelectLanguage={selectedLang} />,
    RCMWorkbench: <RCMWorkbench SelectLanguage={selectedLang} />,
    StaffCashCollection: <StaffCashCollection SelectLanguage={selectedLang} />,
    InvoiceGeneration: <InvoiceGeneration SelectLanguage={selectedLang} />,
    InventorySetup: <InventorySetup SelectLanguage={selectedLang} />,
    InventoryItemMaster: <InventoryItemMaster SelectLanguage={selectedLang} />,
    InvInitialStock: <InvInitialStock SelectLanguage={selectedLang} />,
    InvStockEnquiry: <InvStockEnquiry SelectLanguage={selectedLang} />,
    InvItemMomentEnquiry: (
      <InvItemMomentEnquiry SelectLanguage={selectedLang} />
    ),
    InvRequisitionEntry: <InvRequisitionEntry SelectLanguage={selectedLang} />,
    InvRequisitionList: <InvRequisitionSwitch SelectLanguage={selectedLang} />,
    InvTransferEntry: <InvTransferEntry SelectLanguage={selectedLang} />,
    VendorSetup: <VendorSetup SelectLanguage={selectedLang} />,

    DayEndProcess: <DayEndProcess SelectLanguage={selectedLang} />,

    DeliveryNoteEntry: <DeliveryNoteEntry SelectLanguage={selectedLang} />,
    PurchaseOrderEntry: <PurchaseOrderEntry SelectLanguage={selectedLang} />,
    ReceiptEntry: <ReceiptEntry SelectLanguage={selectedLang} />,
    ShipmentEntry: <ShipmentEntry SelectLanguage={selectedLang} />,
    AcquisitionEntry: <AcquisitionEntry SelectLanguage={selectedLang} />,
    DepreciationEntry: <DepreciationEntry SelectLanguage={selectedLang} />,
    DepreciationReversal: (
      <DepreciationReversal SelectLanguage={selectedLang} />
    ),
    Disposal: <Disposal SelectLanguage={selectedLang} />,
    PurchaseOrderList: <PurchaseOrderList SelectLanguage={selectedLang} />,
    PatientRecall: <PatientRecall SelectLanguage={selectedLang} />,
    AdministrationSetup: <AdministrationSetup SelectLanguage={selectedLang} />,
    OPBillCancellation: <OPBillCancellation SelectLanguage={selectedLang} />,
    OPCreditSettlement: <OPCreditSettlement SelectLanguage={selectedLang} />,
    POSCreditSettlement: <POSCreditSettlement SelectLanguage={selectedLang} />,
    VisitClose: <VisitClose SelectLanguage={selectedLang} />,
    AlgaehModules: <Algaeh />,
    SelfService: <SelfService SelectLanguage={selectedLang} />,
    AttendanceRegularization: (
      <AttendanceRegularization SelectLanguage={selectedLang} />
    ),
    //EmployeeGroup: <EmployeeGroups SelectLanguage={selectedLang} />,
    PayrollSettings: <PayrollSettings SelectLanguage={selectedLang} />,
    TimeSheet: <TimeSheet SelectLanguage={selectedLang} />,
    SalaryManagement: <SalaryManagement SelectLanguage={selectedLang} />,
    HolidayMgmnt: <HolidayMgmnt SelectLanguage={selectedLang} />,
    HRSettings: <HRSettings SelectLanguage={selectedLang} />
  };
};

const directRoutes = (componet, selectedLang, breadStyle) => {
  const MyComponet = componts(selectedLang, breadStyle)[componet];
  AlgaehLoader({ show: false });
  return MyComponet;
};

export default directRoutes;
