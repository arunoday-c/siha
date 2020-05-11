import React, { Suspense } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { retry } from "./utils/GlobalFunctions";
import Login from "./Components/Login/Login";
import Layout from "./Components/common/layout";
import Experiment from "./Components/Experiment";
import ConcurrentTest from "./Components/concurrent-test";
const HISDashboard = React.lazy(() =>
  retry(() => import("./Components/Dashboard/Dashboard"))
);
const FrontdeskDashboard = React.lazy(() =>
  retry(() => import("./Components/Dashboard/frontdesk-dashboard"))
);
const DoctorDashboard = React.lazy(() =>
  retry(() => import("./Components/Dashboard/doctor-dashboard"))
);
const LabDashboard = React.lazy(() =>
  retry(() => import("./Components/Dashboard/lab-dashboard"))
);
const PharmacyDashboard = React.lazy(() =>
  retry(() => import("./Components/Dashboard/pharmacy-dashboard"))
);
const InventoryDashboard = React.lazy(() =>
  retry(() => import("./Components/Dashboard/inventory-dashboard"))
);
const HrDashboard = React.lazy(() =>
  retry(() => import("./Components/Dashboard/hr-dashboard"))
);
const FinDashboard = React.lazy(() =>
  retry(() => import("./Components/Dashboard/fin-dashboard"))
);
// const CommonDashboard = React.lazy(() =>
//   retry(() => import("./Components/Dashboard/Dashboard"))
// );
const PatientRegistration = React.lazy(() =>
  retry(() => import("./Components/RegistrationPatient/RegistrationPatient"))
);
// const Layout = React.lazy(() =>
//   retry(() => import("./Components/common/layout"))
// );
const UpdatePatientDetails = React.lazy(() =>
  retry(() => import("./Components/UpdatePatientDetails/UpdatePatientDetails"))
);
const BusinessSetup = React.lazy(() =>
  retry(() => import("./Components/BusinessSetup/BusinessSetup"))
);
const CommonSetup = React.lazy(() =>
  retry(() => import("./Components/CommonSetup/CommonSetup"))
);
const OPBilling = React.lazy(() =>
  retry(() => import("./Components/OPBilling/OPBilling"))
);
const BillDetails = React.lazy(() =>
  retry(() => import("./Components/BillDetails/BillDetails"))
);
const InsuranceSetup = React.lazy(() =>
  retry(() => import("./Components/InsuranceSetup/InsuranceSetup"))
);
const SampleCollection = React.lazy(() =>
  retry(() =>
    import("./Components/Laboratory/SampleCollection/SampleCollection")
  )
);
//ToDo: not working
const DoctorsWorkbench = React.lazy(() =>
  retry(() => import("./Components/DoctorsWorkbench/DoctorsWorkbench"))
);
//ToDo: not working
const NurseWorkbench = React.lazy(() =>
  retry(() => import("./Components/NurseWorkbench/NurseWorkbench"))
);

const PatientProfile = React.lazy(() =>
  retry(() => import("./Components/PatientProfile/ProfileContainer"))
);

const PatientPackages = React.lazy(() =>
  retry(() => import("./Components/PatientPackages/PatientPackages"))
);

const AcknowledgeList = React.lazy(() =>
  retry(() => import("./Components/Pharmacy/AcknowledgeList/AcknowledgeSwitch"))
);
const ExpiringItemList = React.lazy(() =>
  retry(() => import("./Components/Pharmacy/ExpiringItemList/ExpiringItemList"))
);
const InvAcknowledgeList = React.lazy(() =>
  retry(() =>
    import("./Components/Inventory/InvAcknowledgeList/InvAcknowledgeSwitch")
  )
);

const MedicalWorkbenchSetup = React.lazy(() =>
  retry(() =>
    import("./Components/MedicalWorkbenchSetup/MedicalWorkbenchSetup")
  )
);
const FinanceFragment = React.lazy(() =>
  retry(() => import("./Components/FinanceFragment"))
);
const AccessionAcknowledgement = React.lazy(() =>
  retry(() =>
    import(
      "./Components/Laboratory/AccessionAcknowledgement/AccessionAcknowledgement"
    )
  )
);
const PreApproval = React.lazy(() =>
  retry(() => import("./Components/PreApproval/PreApproval"))
);
const LabSetup = React.lazy(() =>
  retry(() => import("./Components/LabSetup/LabSetup"))
);
const InvestigationSetup = React.lazy(() =>
  retry(() => import("./Components/InvestigationSetup/InvestigationSetup"))
);
const InventoryItemMaster = React.lazy(() =>
  retry(() => import("./Components/InventoryItemMaster/InventoryItemMaster"))
);
const RadOrderedList = React.lazy(() =>
  retry(() => import("./Components/Radiology/RadOrderedList/RadOrderedList"))
);
const RadScheduledList = React.lazy(() =>
  retry(() =>
    import("./Components/Radiology/RadScheduledList/RadScheduledList")
  )
);
const PrescriptionList = React.lazy(() =>
  retry(() => import("./Components/Pharmacy/PrescriptionList/PrescriptionList"))
);
const StockEnquiry = React.lazy(() =>
  retry(() => import("./Components/Pharmacy/StockEnquiry/StockEnquiry"))
);
const ItemSetup = React.lazy(() =>
  retry(() => import("./Components/ItemSetup/ItemSetup"))
);
const FrontDesk = React.lazy(() =>
  retry(() => import("./Components/FrontDesk/FrontDesk"))
);
const ResultEntryList = React.lazy(() =>
  retry(() => import("./Components/Laboratory/ResultEntryList/ResultEntryList"))
);
const RequisitionEntry = React.lazy(() =>
  retry(() => import("./Components/Pharmacy/RequisitionEntry/RequisitionEntry"))
);
const TransferEntry = React.lazy(() =>
  retry(() => import("./Components/Pharmacy/TransferEntry/TransferEntry"))
);
const ReportsList = React.lazy(() =>
  retry(() => import("./Components/Reports/Reports"))
);
const RCMWorkbench = React.lazy(() =>
  retry(() => import("./Components/InsuranceClaims/RCMWorkbench/RCMWorkbench"))
);
const VisitClose = React.lazy(() =>
  retry(() => import("./Components/VisitClose/VisitClose"))
);
const AlgaehModules = React.lazy(() =>
  retry(() => import("./Components/Algaeh/Algaeh"))
);

const PointOfSale = React.lazy(() =>
  retry(() => import("./Components/Pharmacy/PointOfSale/PointOfSale"))
);
const MRDList = React.lazy(() => retry(() => import("./Components/MRD/MRD")));
const InvoiceGeneration = React.lazy(() =>
  retry(() =>
    import("./Components/InsuranceClaims/InvoiceGeneration/InvoiceGeneration")
  )
);

const ItemMomentEnquiry = React.lazy(() =>
  retry(() =>
    import("./Components/Pharmacy/ItemMomentEnquiry/ItemMomentEnquiry")
  )
);
const PharmacySetup = React.lazy(() =>
  retry(() => import("./Components/PharmacySetup/PharmacySetup"))
);
const ProcedureSetup = React.lazy(() =>
  retry(() => import("./Components/ProcedureSetup/ProcedureSetup"))
);
const VendorSetup = React.lazy(() =>
  retry(() => import("./Components/VendorSetup/VendorSetup"))
);

const CustomerSetup = React.lazy(() =>
  retry(() => import("./Components/CustomerSetup/CustomerSetup"))
);
const ERPSettings = React.lazy(() =>
  retry(() => import("./Components/ERPSettings/ERPSettings"))
);
const SalesSetup = React.lazy(() =>
  retry(() => import("./Components/SalesSetup/SalesSetup"))
);

const DayEndProcess = React.lazy(() =>
  retry(() => import("./Components/Finance/DayEndProcess/DayEndProcess"))
);

const AppointmentSetup = React.lazy(() =>
  retry(() => import("./Components/AppointmentSetup/AppointmentSetup"))
);
const EmployeeMasterIndex = React.lazy(() =>
  retry(() =>
    import(
      "./Components/EmployeeManagement/EmployeeMasterIndex/EmployeeMasterIndex"
    )
  )
);
const PhysicianScheduleSetup = React.lazy(() =>
  retry(() => import("./Components/PhysicianScheduleSetup/PhySchSetup"))
);
const DoctorCommission = React.lazy(() =>
  retry(() => import("./Components/DoctorCommission/DoctorCommission"))
);
const HospitalServiceSetup = React.lazy(() =>
  retry(() => import("./Components/HospitalServiceSetup/HospitalServiceSetup"))
);

const InventorySetup = React.lazy(() =>
  retry(() => import("./Components/InventorySetup/InventorySetup"))
);

const OPBillPendingList = React.lazy(() =>
  retry(() => import("./Components/OPBillPendingList/OPBillPendingList"))
);
const SalesReturn = React.lazy(() =>
  retry(() => import("./Components/Pharmacy/SalesReturn/SalesReturn"))
);
const AdministrationSetup = React.lazy(() =>
  retry(() => import("./Components/AdministrationSetup/AdminSetup"))
);
const OPBillCancellation = React.lazy(() =>
  retry(() => import("./Components/OPBillCancellation/OPBillCancellation"))
);

const OPCreditSettlement = React.lazy(() =>
  retry(() => import("./Components/OPCreditSettlement/OPCreditSettlement"))
);

const POSCreditSettlement = React.lazy(() =>
  retry(() =>
    import("./Components/Pharmacy/POSCreditSettlement/POSCreditSettlement")
  )
);

const StockAdjustment = React.lazy(() =>
  retry(() => import("./Components/Pharmacy/StockAdjustment/StockAdjustment"))
);

const SelfService = React.lazy(() =>
  retry(() => import("./Components/EmployeeManagement/SelfService/SelfService"))
);
const EmpServ = React.lazy(() =>
  retry(() =>
    import("./Components/EmployeeManagement/EmployeeServices/EmployeeServices")
  )
);
const AttendanceRegularization = React.lazy(() =>
  retry(() =>
    import(
      "./Components/EmployeeManagement/AttendanceRegularization/AttendanceRegularization"
    )
  )
);
const PayrollSettings = React.lazy(() =>
  retry(() =>
    import("./Components/PayrollManagement/PayrollSettings/PayrollSettings")
  )
);

const SalaryManagement = React.lazy(() =>
  retry(() =>
    import("./Components/PayrollManagement/SalaryManagement/SalaryManagement")
  )
);
const HolidayMgmnt = React.lazy(() =>
  retry(() =>
    import("./Components/PayrollManagement/HolidayManagement/HolidayMgmnt")
  )
);
const HRSettings = React.lazy(() =>
  retry(() => import("./Components/EmployeeManagement/HRSettings/HRSettings"))
);
const LeaveManagement = React.lazy(() =>
  retry(() =>
    import("./Components/PayrollManagement/LeaveManagement/LeaveManagement")
  )
);
const AttendanceManagement = React.lazy(() =>
  retry(() =>
    import("./Components/PayrollManagement/AttendanceMgmt/AttendanceMgmt")
  )
);
const ExitManagement = React.lazy(() =>
  retry(() =>
    import("./Components/PayrollManagement/ExitManagement/ExitManagement")
  )
);
const LoanManagement = React.lazy(() =>
  retry(() =>
    import("./Components/PayrollManagement/LoanManagement/LoanManagement")
  )
);
const PayrollWorkBench = React.lazy(() =>
  retry(() =>
    import("./Components/PayrollManagement/PayrollWorkbench/PayrollWorkbench")
  )
);
const PerformanceManagement = React.lazy(() =>
  retry(() =>
    import(
      "./Components/PayrollManagement/PerformanceManagement/PerformanceManagement"
    )
  )
);
const EmployeeDocuments = React.lazy(() =>
  retry(() =>
    import(
      "./Components/EmployeeManagement/EmployeeDocuments/EmployeeDocuments"
    )
  )
);
const PayrollOptions = React.lazy(() =>
  retry(() =>
    import("./Components/PayrollManagement/PayrollOptions/PayrollOptions")
  )
);

const ClinicalDeskNew = React.lazy(() =>
  retry(() => import("./Components/DoctorsWorkbench/DoctorsWorkbench-new"))
);
const EmpShiftRost = React.lazy(() =>
  retry(() =>
    import(
      "./Components/EmployeeManagement/EmployeeShiftRostering/EmployeeShiftRostering"
    )
  )
);
const Wps = React.lazy(() =>
  retry(() => import("./Components/PayrollManagement/WPS/WPS"))
);

const ProjJobCst = React.lazy(() =>
  retry(() =>
    import("./Components/EmployeeManagement/ProjectJobCost/ProjectJobCost")
  )
);
const OrgChart = React.lazy(() =>
  retry(() => import("./Components/OrgChart/OrgChart"))
);

const PackageSetup = React.lazy(() =>
  retry(() => import("./Components/PackageSetup/PackageSetup"))
);

const FavouriteOrderList = React.lazy(() =>
  retry(() => import("./Components/FavouriteOrderList/FavouriteOrderList"))
);
// const PackageBilling = React.lazy(() =>
//   retry(() => import("./Components/PackageBilling/PackageBilling"))
// );
const DiagramMaster = React.lazy(() =>
  retry(() => import("./Components/DiagramMaster/DiagramMaster"))
);
const PhysioTherapy = React.lazy(() =>
  retry(() => import("./Components/PhysioTherapy/PhysioTherapy"))
);
const DentalLab = React.lazy(() =>
  retry(() => import("./Components/Laboratory/DentalLab/DentalLab"))
);
const SalesQuotation = React.lazy(() =>
  retry(() => import("./Components/Sales/SalesQuotation/SalesQuotation"))
);

const SalesOrder = React.lazy(() =>
  retry(() => import("./Components/Sales/SalesOrder/SalesOrder"))
);
const DispatchNote = React.lazy(() =>
  retry(() => import("./Components/Sales/DispatchNote/DispatchNote"))
);
const ContractManagement = React.lazy(() =>
  retry(() =>
    import("./Components/Sales/ContractManagement/ContractManagement")
  )
);
const SalesInvoice = React.lazy(() =>
  retry(() => import("./Components/Sales/SalesInvoice/SalesInvoice"))
);
const SalesQuotationList = React.lazy(() =>
  retry(() =>
    import("./Components/Sales/SalesQuotationList/SalesQuotationSwitch")
  )
);
const SalesOrderList = React.lazy(() =>
  retry(() => import("./Components/Sales/SalesOrderList/SalesOrderSwitch"))
);

const SalesReturnEntry = React.lazy(() =>
  retry(() => import("./Components/Sales/SalesReturnEntry/SalesReturnEntry"))
);

const CustomerContractList = React.lazy(() =>
  retry(() => import("./Components/Sales/CustomerContractList/CustomerContractList"))
);

const PatientRecall = React.lazy(() =>
  retry(() => import("./Components/PatientRecall/PatientRecall"))
);
const StaffCashCollection = React.lazy(() =>
  retry(() => import("./Components/StaffCashCollection/StaffCashCollection"))
);

const WorkListGeneration = React.lazy(() =>
  retry(() =>
    import("./Components/InsuranceClaims/WorkListGeneration/WorkListGeneration")
  )
);
const InitialStock = React.lazy(() =>
  retry(() => import("./Components/Pharmacy/InitialStock/InitialStock"))
);

const InvInitialStock = React.lazy(() =>
  retry(() => import("./Components/Inventory/InvInitialStock/InvInitialStock"))
);

const InvStockEnquiry = React.lazy(() =>
  retry(() => import("./Components/Inventory/InvStockEnquiry/InvStockEnquiry"))
);

const InvItemMomentEnquiry = React.lazy(() =>
  retry(() =>
    import("./Components/Inventory/InvItemMomentEnquiry/InvItemMomentEnquiry")
  )
);
const InvRequisitionEntry = React.lazy(() =>
  retry(() =>
    import("./Components/Inventory/InvRequisitionEntry/InvRequisitionEntry")
  )
);
const RequisitionList = React.lazy(() =>
  retry(() => import("./Components/Pharmacy/RequisitionList/RequisitionSwitch"))
);
const InvRequisitionList = React.lazy(() =>
  retry(() =>
    import("./Components/Inventory/InvRequisitionList/InvRequisitionSwitch")
  )
);
const InvTransferEntry = React.lazy(() =>
  retry(() =>
    import("./Components/Inventory/InvTransferEntry/InvTransferEntry")
  )
);
const ConsumptionEntry = React.lazy(() =>
  retry(() => import("./Components/Pharmacy/ConsumptionEntry/ConsumptionEntry"))
);
const InvConsumptionEntry = React.lazy(() =>
  retry(() =>
    import("./Components/Inventory/InvConsumptionEntry/InvConsumptionEntry")
  )
);
const InvPointOfSale = React.lazy(() =>
  retry(() => import("./Components/Inventory/InvPointOfSale/InvPointOfSale"))
);
const InvStockAdjustment = React.lazy(() =>
  retry(() =>
    import("./Components/Inventory/InvStockAdjustment/InvStockAdjustment")
  )
);

const PurchaseOrderEntry = React.lazy(() =>
  retry(() =>
    import("./Components/Procurement/PurchaseOrderEntry/PurchaseOrderEntry")
  )
);
const PurchaseReturnEntry = React.lazy(() =>
  retry(() =>
    import("./Components/Procurement/PurchaseReturnEntry/PurchaseReturnEntry")
  )
);
const PurchaseRequestList = React.lazy(() =>
  retry(() =>
    import("./Components/Procurement/PurchaseRequestList/PurchaseRequestList")
  )
);
const PurchaseOrderList = React.lazy(() =>
  retry(() =>
    import("./Components/Procurement/PurchaseOrderList/PurchaseSwitch")
  )
);
const DeliveryNoteEntry = React.lazy(() =>
  retry(() =>
    import("./Components/Procurement/DeliveryNoteEntry/DeliveryNoteEntry")
  )
);

const ReceiptEntry = React.lazy(() =>
  retry(() => import("./Components/Procurement/ReceiptEntry/ReceiptEntry"))
);
const ShipmentEntry = React.lazy(() =>
  retry(() => import("./Components/Procurement/ShipmentEntry/ShipmentEntry"))
);
const RequestForQuotation = React.lazy(() =>
  retry(() =>
    import("./Components/Procurement/RequestForQuotation/RequestForQuotation")
  )
);

const VendorsQuotation = React.lazy(() =>
  retry(() =>
    import("./Components/Procurement/VendorsQuotation/VendorsQuotation")
  )
);
const QuotationCompare = React.lazy(() =>
  retry(() =>
    import("./Components/Procurement/QuotationCompare/QuotationCompare")
  )
);
const DefaultLandingPage = React.lazy(() =>
  retry(() => import("./Components/Dashboard/defaultlandingPage"))
);
function LoadComponent({ path, noSecurityCheck, children }) {
  return (
    <Layout path={path} noSecurityCheck={noSecurityCheck}>
      <Suspense
        fallback={
          <div className="loader-container">
            <div className="algaeh-progress float shadow">
              <div className="progress__item">loading</div>
            </div>
          </div>
        }
      >
        {children}
      </Suspense>
    </Layout>
  );
}

const appRoutes = [
  {
    path: "/",
    isExactPath: true,
    component: <Login />
  },
  {
    path: "/NoDashboard",
    isExactPath: true,
    noSecurityCheck: true,
    component: <DefaultLandingPage />
  },
  // {
  //   path: "/CommonDashboard",
  //   isExactPath: true,
  //   component: (
  //
  //       <CommonDashboard />
  //
  //   )
  // },
  {
    path: "/HISDashboard",
    isExactPath: true,
    component: <HISDashboard />
  },
  {
    path: "/FrontdeskDashboard",
    isExactPath: true,
    component: <FrontdeskDashboard />
  },
  {
    path: "/DoctorDashboard",
    isExactPath: true,
    component: <DoctorDashboard />
  },
  {
    path: "/LabDashboard",
    isExactPath: true,
    component: <LabDashboard />
  },
  {
    path: "/PharmacyDashboard",
    isExactPath: true,
    component: <PharmacyDashboard />
  },
  {
    path: "/InventoryDashboard",
    isExactPath: true,
    component: <InventoryDashboard />
  },
  {
    path: "/HrDashboard",
    isExactPath: true,
    component: <HrDashboard />
  },
  {
    path: "/FinDashboard",
    isExactPath: true,
    component: <FinDashboard />
  },
  {
    path: "/AlgaehModules",
    isExactPath: true,
    component: <AlgaehModules />
  },

  {
    path: "/PointOfSale",
    isExactPath: true,
    component: <PointOfSale />
  },

  {
    path: "/ItemSetup",
    isExactPath: true,
    component: <ItemSetup />
  },
  {
    path: "/AppointmentSetup",
    isExactPath: true,
    component: <AppointmentSetup />
  },
  {
    path: "/LabSetup",
    isExactPath: true,
    component: <LabSetup />
  },
  {
    path: "/HospitalServiceSetup",
    isExactPath: true,
    component: <HospitalServiceSetup />
  },
  {
    path: "/InventorySetup",
    isExactPath: true,
    component: <InventorySetup />
  },
  {
    path: "/InvestigationSetup",
    isExactPath: true,
    component: <InvestigationSetup />
  },
  {
    path: "/InventoryItemMaster",
    isExactPath: true,
    component: <InventoryItemMaster />
  },
  {
    path: "/MRDList",
    isExactPath: true,
    component: <MRDList />
  },
  {
    path: "/InvoiceGeneration",
    isExactPath: true,
    component: <InvoiceGeneration />
  },
  {
    path: "/ItemMomentEnquiry",
    isExactPath: true,
    component: <ItemMomentEnquiry />
  },
  {
    path: "/FrontDesk",
    isExactPath: true,
    component: <PatientRegistration />
  },
  {
    path: "/Appointment",
    isExactPath: true,
    component: <FrontDesk screen="Appointment" />
  },
  {
    path: "/UpdatePatientDetails",
    isExactPath: true,
    component: <UpdatePatientDetails />
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
    path: "/OPBilling",
    isExactPath: true,
    component: <OPBilling />
  },
  {
    path: "/BillDetails",
    isExactPath: true,
    component: <BillDetails />
  },
  {
    path: "/InsuranceSetup",
    isExactPath: true,
    component: <InsuranceSetup />
  },
  {
    path: "/SampleCollection",
    isExactPath: true,
    component: <SampleCollection />
  },
  {
    path: "/DoctorsWorkbench",
    isExactPath: true,
    component: <DoctorsWorkbench />
  },
  {
    path: "/NurseWorkbench",
    isExactPath: true,
    component: <NurseWorkbench />
  },
  {
    path: "/PatientPackages",
    isExactPath: true,
    component: <PatientPackages />
  },

  {
    path: "/PatientProfile",
    isExactPath: true,
    component: <PatientProfile />
  },
  {
    path: "/AcknowledgeList",
    isExactPath: true,
    component: <AcknowledgeList />
  },
  {
    path: "/ExpiringItemList",
    isExactPath: true,
    component: <ExpiringItemList />
  },
  {
    path: "/InvAcknowledgeList",
    isExactPath: true,
    component: <InvAcknowledgeList />
  },
  {
    path: "/MedicalWorkbenchSetup",
    isExactPath: true,
    component: <MedicalWorkbenchSetup />
  },
  {
    path: "/PharmacySetup",
    isExactPath: true,
    component: <PharmacySetup />
  },
  {
    path: "/ProcedureSetup",
    isExactPath: true,
    component: <ProcedureSetup />
  },
  {
    path: "/VendorSetup",
    isExactPath: true,
    component: <VendorSetup />
  },
  {
    path: "/CustomerSetup",
    isExactPath: true,
    component: <CustomerSetup />
  },
  {
    path: "/ERPSettings",
    isExactPath: true,
    component: <ERPSettings />
  },
  {
    path: "/SalesSetup",
    isExactPath: true,
    component: <SalesSetup />
  },
  {
    path: "/DayEndProcess",
    isExactPath: true,
    component: <DayEndProcess />
  },

  {
    path: "/FinanceMapping",
    isExactPath: true,
    component: <FinanceFragment path="Mapping" />
  },

  {
    path: "/CostCenter",
    isExactPath: true,
    component: <FinanceFragment path="CostCenter" />
  },

  {
    path: "/Accounts",
    isExactPath: true,
    component: <FinanceFragment path="Accounts" />
  },
  {
    path: "/Transactions",
    isExactPath: true,
    component: <FinanceFragment path="Transactions" />
  },
  {
    path: "/JournalVoucher",
    isExactPath: true,
    component: <FinanceFragment path="JournalVoucher" />
  },
  {
    path: "/FinanceReports",
    isExactPath: true,
    component: <FinanceFragment path="FinanceReports" />
  },
  {
    path: "/FinanceOptions",
    isExactPath: true,
    component: <FinanceFragment path="FinanceOptions" />
  },
  {
    path: "/QuickSearchFinance",
    isExactPath: true,
    component: <FinanceFragment path="QuickSearchFinance" />
  },
  {
    path: "/CustomerListFinance",
    isExactPath: true,
    component: <FinanceFragment path="CustomerListFinance" />
  },
  {
    path: "/CustomerPayment",
    isExactPath: true,
    component: <FinanceFragment path="CustomerPayment" />
  },
  {
    path: "/SupplierListFinance",
    isExactPath: true,
    component: <FinanceFragment path="SupplierListFinance" />
  },
  {
    path: "/SupplierPayment",
    isExactPath: true,
    component: <FinanceFragment path="SupplierPayment" />
  },
  {
    path: "/NurseWorkbench",
    isExactPath: true,
    component: <NurseWorkbench />
  },
  {
    path: "/AdministrationSetup",
    isExactPath: true,
    component: <AdministrationSetup />
  },
  {
    path: "/OPBillCancellation",
    isExactPath: true,
    component: <OPBillCancellation />
  },
  {
    path: "/OPCreditSettlement",
    isExactPath: true,
    component: <OPCreditSettlement />
  },
  {
    path: "/POSCreditSettlement",
    isExactPath: true,
    component: <POSCreditSettlement />
  },
  {
    path: "/StockAdjustment",
    isExactPath: true,
    component: <StockAdjustment />
  },
  {
    path: "/SelfService",
    isExactPath: true,
    component: <SelfService />
  },
  {
    path: "/EmpServ",
    isExactPath: true,
    component: <EmpServ />
  },
  {
    path: "/AttendanceRegularization",
    isExactPath: true,
    component: <AttendanceRegularization />
  },
  {
    path: "/PayrollSettings",
    isExactPath: true,
    component: <PayrollSettings />
  },
  {
    path: "/SalaryManagement",
    isExactPath: true,
    component: <SalaryManagement />
  },
  {
    path: "/HolidayMgmnt",
    isExactPath: true,
    component: <HolidayMgmnt />
  },
  {
    path: "/HRSettings",
    isExactPath: true,
    component: <HRSettings />
  },
  {
    path: "/LeaveManagement",
    isExactPath: true,
    component: <LeaveManagement />
  },
  {
    path: "/AttendanceManagement",
    isExactPath: true,
    component: <AttendanceManagement />
  },
  {
    path: "/ExitManagement",
    isExactPath: true,
    component: <ExitManagement />
  },
  {
    path: "/PayrollSettings",
    isExactPath: true,
    component: <PayrollSettings />
  },
  {
    path: "/LoanManagement",
    isExactPath: true,
    component: <LoanManagement />
  },
  {
    path: "/PayrollWorkBench",
    isExactPath: true,
    component: <PayrollWorkBench />
  },
  {
    path: "/PerformanceManagement",
    isExactPath: true,
    component: <PerformanceManagement />
  },
  {
    path: "/EmployeeDocuments",
    isExactPath: true,
    component: <EmployeeDocuments />
  },
  {
    path: "/PayrollOptions",
    isExactPath: true,
    component: <PayrollOptions />
  },
  {
    path: "/ClinicalDeskNew",
    isExactPath: true,
    component: <ClinicalDeskNew />
  },
  {
    path: "/EmpShiftRost",
    isExactPath: true,
    component: <EmpShiftRost />
  },
  {
    path: "/Wps",
    isExactPath: true,
    component: <Wps />
  },
  {
    path: "/ProjJobCst",
    isExactPath: true,
    component: <ProjJobCst />
  },
  {
    path: "/OrgChart",
    isExactPath: true,
    component: <OrgChart />
  },
  {
    path: "/PackageSetup",
    isExactPath: true,
    component: <PackageSetup />
  },
  {
    path: "/FavouriteOrderList",
    isExactPath: true,
    component: <FavouriteOrderList />
  },
  // {
  //   path: "/PackageBilling",
  //   isExactPath: true,
  //   component: <PackageBilling />
  // },
  {
    path: "/DiagramMaster",
    isExactPath: true,
    component: <DiagramMaster />
  },
  {
    path: "/PhysioTherapy",
    isExactPath: true,
    component: <PhysioTherapy />
  },
  {
    path: "/DentalLab",
    isExactPath: true,
    component: <DentalLab />
  },
  {
    path: "/SalesQuotation",
    isExactPath: true,
    component: <SalesQuotation />
  },
  {
    path: "/SalesOrder",
    isExactPath: true,
    component: <SalesOrder />
  },
  {
    path: "/DispatchNote",
    isExactPath: true,
    component: <DispatchNote />
  },
  {
    path: "/ContractManagement",
    isExactPath: true,
    component: <ContractManagement />
  },
  {
    path: "/SalesInvoice",
    isExactPath: true,
    component: <SalesInvoice />
  },
  {
    path: "/SalesQuotationList",
    isExactPath: true,
    component: <SalesQuotationList />
  },
  {
    path: "/SalesOrderList",
    isExactPath: true,
    component: <SalesOrderList />
  },
  {
    path: "/SalesReturnEntry",
    isExactPath: true,
    component: <SalesReturnEntry />
  },
  {
    path: "/CustomerContractList",
    isExactPath: true,
    component: <CustomerContractList />
  },

  {
    path: "/PatientRecall",
    isExactPath: true,
    component: <PatientRecall />
  },

  {
    path: "/StaffCashCollection",
    isExactPath: true,
    component: <StaffCashCollection />
  },

  {
    path: "/PhysicianScheduleSetup",
    isExactPath: true,
    component: <PhysicianScheduleSetup />
  },

  {
    path: "/VisitClose",
    isExactPath: true,
    component: <VisitClose />
  },

  {
    path: "/OPBillPendingList",
    isExactPath: true,
    component: <OPBillPendingList />
  },

  {
    path: "/AccessionAcknowledgement",
    isExactPath: true,
    component: <AccessionAcknowledgement />
  },

  {
    path: "/ResultEntryList",
    isExactPath: true,
    component: <ResultEntryList />
  },

  {
    path: "/RadOrderedList",
    isExactPath: true,
    component: <RadOrderedList />
  },

  {
    path: "/RadScheduledList",
    isExactPath: true,
    component: <RadScheduledList />
  },

  {
    path: "/PreApproval",
    isExactPath: true,
    component: <PreApproval />
  },

  {
    path: "/WorkListGeneration",
    isExactPath: true,
    component: <WorkListGeneration />
  },

  {
    path: "/RCMWorkbench",
    isExactPath: true,
    component: <RCMWorkbench />
  },
  {
    path: "/InitialStock",
    isExactPath: true,
    component: <InitialStock />
  },
  {
    path: "/InvInitialStock",
    isExactPath: true,
    component: <InvInitialStock />
  },
  {
    path: "/InvStockEnquiry",
    isExactPath: true,
    component: <InvStockEnquiry />
  },
  {
    path: "/InvItemMomentEnquiry",
    isExactPath: true,
    component: <InvItemMomentEnquiry />
  },
  {
    path: "/InvRequisitionEntry",
    isExactPath: true,
    component: <InvRequisitionEntry />
  },
  {
    path: "/InvRequisitionList",
    isExactPath: true,
    component: <InvRequisitionList />
  },
  {
    path: "/InvTransferEntry",
    isExactPath: true,
    component: <InvTransferEntry />
  },
  {
    path: "/SalesReturn",
    isExactPath: true,
    component: <SalesReturn />
  },
  {
    path: "/PrescriptionList",
    isExactPath: true,
    component: <PrescriptionList />
  },
  {
    path: "/StockEnquiry",
    isExactPath: true,
    component: <StockEnquiry />
  },

  {
    path: "/InvConsumptionEntry",
    isExactPath: true,
    component: <InvConsumptionEntry />
  },
  {
    path: "/InvPointOfSale",
    isExactPath: true,
    component: <InvPointOfSale />
  },
  {
    path: "/PurchaseOrderEntry",
    isExactPath: true,
    component: <PurchaseOrderEntry />
  },
  {
    path: "/PurchaseReturnEntry",
    isExactPath: true,
    component: <PurchaseReturnEntry />
  },
  {
    path: "/PurchaseOrderList",
    isExactPath: true,
    component: <PurchaseOrderList />
  },
  {
    path: "/PurchaseRequestList",
    isExactPath: true,
    component: <PurchaseRequestList />
  },
  {
    path: "/DeliveryNoteEntry",
    isExactPath: true,
    component: <DeliveryNoteEntry />
  },
  {
    path: "/ReceiptEntry",
    isExactPath: true,
    component: <ReceiptEntry />
  },
  {
    path: "/ShipmentEntry",
    isExactPath: true,
    component: <ShipmentEntry />
  },
  {
    path: "/RequestForQuotation",
    isExactPath: true,
    component: <RequestForQuotation />
  },
  {
    path: "/InvStockAdjustment",
    isExactPath: true,
    component: <InvStockAdjustment />
  },
  {
    path: "/EmployeeMasterIndex",
    isExactPath: true,
    component: <EmployeeMasterIndex />
  },
  {
    path: "/VendorsQuotation",
    isExactPath: true,
    component: <VendorsQuotation />
  },
  {
    path: "/QuotationCompare",
    isExactPath: true,
    component: <QuotationCompare />
  },
  {
    path: "/DoctorCommission",
    isExactPath: true,
    component: <DoctorCommission />
  },
  {
    path: "/DoctorCommission",
    isExactPath: true,
    component: <DoctorCommission />
  },
  {
    path: "/RequisitionEntry",
    isExactPath: true,
    component: <RequisitionEntry />
  },
  {
    path: "/RequisitionList",
    isExactPath: true,
    component: <RequisitionList />
  },
  {
    path: "/ReportsList/:name",
    isExactPath: true,
    others: {
      strict: true
    },
    component: <ReportsList />
  },
  {
    path: "/TransferEntry",
    isExactPath: true,
    component: <TransferEntry />
  },
  {
    path: "/ConsumptionEntry",
    isExactPath: true,
    component: <ConsumptionEntry />
  },

  {
    path: "/JournalAuthorization",
    isExactPath: true,
    component: <FinanceFragment path="JournalAuthorization" />
  },
  {
    path: "/Experiment",
    isExactPath: true,
    component: <Experiment />
  },
  {
    path: "/ConcurrentTest",
    isExactPath: true,
    component: <ConcurrentTest />
  },
  {
    path: "*",
    component: <DefaultLandingPage />
  }
];

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        {appRoutes.map((routeItem, idx) => {
          // const others = routeItem.others === undefined ? {} : routeItem.others;
          const path = routeItem.path.replace("/?", "?");
          const noSecurityCheck = routeItem.noSecurityCheck;
          return (
            <Route
              key={routeItem.path}
              path={path}
              exact={routeItem.isExactPath}
              strict={true}
              render={params => {
                if (routeItem.path === "/") return routeItem.component;
                else {
                  return (
                    <LoadComponent
                      path={path}
                      noSecurityCheck={noSecurityCheck}
                    >
                      {routeItem.component}
                    </LoadComponent>
                  );
                }
              }}
            />
          );
        })}
      </Switch>
    </BrowserRouter>
  );
}
export default Routes;
