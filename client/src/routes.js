import React, { Suspense } from "react";
import {
  Switch,
  Route,
  BrowserRouter,
  HashRouter,
  useRouteMatch
} from "react-router-dom";
import { retry } from "./utils/GlobalFunctions";
import Login from "./Components/Login/Login";
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
// const CommonDashboard = React.lazy(() =>
//   retry(() => import("./Components/Dashboard/Dashboard"))
// );
const PatientRegistration = React.lazy(() =>
  retry(() => import("./Components/RegistrationPatient/RegistrationPatient"))
);
const Layout = React.lazy(() =>
  retry(() => import("./Components/common/layout"))
);
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
  retry(() => import("./Components/PatientProfile/PatientProfile"))
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
const AppSetup = React.lazy(() =>
  retry(() => import("./Components/AppSetup/AppSetup"))
);
const PackageSetup = React.lazy(() =>
  retry(() => import("./Components/PackageSetup/PackageSetup"))
);

const FavouriteOrderList = React.lazy(() =>
  retry(() => import("./Components/FavouriteOrderList/FavouriteOrderList"))
);
const PackageBilling = React.lazy(() =>
  retry(() => import("./Components/PackageBilling/PackageBilling"))
);
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
function LoadComponent({ children }) {
  return (
    <Suspense
      fallback={
        <div className="loader-container">
          <div className="algaeh-progress float shadow">
            <div className="progress__item">loading</div>
          </div>
        </div>
      }
    >
      <Layout>{children}</Layout>
    </Suspense>
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
    component: (
      <LoadComponent>
        <DefaultLandingPage />
      </LoadComponent>
    )
  },
  // {
  //   path: "/CommonDashboard",
  //   isExactPath: true,
  //   component: (
  //     <LoadComponent>
  //       <CommonDashboard />
  //     </LoadComponent>
  //   )
  // },
  {
    path: "/HISDashboard",
    isExactPath: true,
    component: (
      <LoadComponent>
        <HISDashboard />
      </LoadComponent>
    )
  },
  {
    path: "/FrontdeskDashboard",
    isExactPath: true,
    component: (
      <LoadComponent>
        <FrontdeskDashboard />
      </LoadComponent>
    )
  },
  {
    path: "/DoctorDashboard",
    isExactPath: true,
    component: (
      <LoadComponent>
        <DoctorDashboard />
      </LoadComponent>
    )
  },
  {
    path: "/LabDashboard",
    isExactPath: true,
    component: (
      <LoadComponent>
        <LabDashboard />
      </LoadComponent>
    )
  },
  {
    path: "/PharmacyDashboard",
    isExactPath: true,
    component: (
      <LoadComponent>
        <PharmacyDashboard />
      </LoadComponent>
    )
  },
  {
    path: "/InventoryDashboard",
    isExactPath: true,
    component: (
      <LoadComponent>
        <InventoryDashboard />
      </LoadComponent>
    )
  },
  {
    path: "/HrDashboard",
    isExactPath: true,
    component: (
      <LoadComponent>
        <HrDashboard />
      </LoadComponent>
    )
  },
  {
    path: "/AlgaehModules",
    isExactPath: true,
    component: (
      <LoadComponent>
        <AlgaehModules />
      </LoadComponent>
    )
  },

  {
    path: "/PointOfSale",
    isExactPath: true,
    component: (
      <LoadComponent>
        <PointOfSale />
      </LoadComponent>
    )
  },

  {
    path: "/ItemSetup",
    isExactPath: true,
    component: (
      <LoadComponent>
        <ItemSetup />
      </LoadComponent>
    )
  },
  {
    path: "/AppointmentSetup",
    isExactPath: true,
    component: (
      <LoadComponent>
        <AppointmentSetup />
      </LoadComponent>
    )
  },
  {
    path: "/LabSetup",
    isExactPath: true,
    component: (
      <LoadComponent>
        <LabSetup />
      </LoadComponent>
    )
  },
  {
    path: "/HospitalServiceSetup",
    isExactPath: true,
    component: (
      <LoadComponent>
        <HospitalServiceSetup />
      </LoadComponent>
    )
  },
  {
    path: "/InventorySetup",
    isExactPath: true,
    component: (
      <LoadComponent>
        <InventorySetup />
      </LoadComponent>
    )
  },
  {
    path: "/InvestigationSetup",
    isExactPath: true,
    component: (
      <LoadComponent>
        <InvestigationSetup />
      </LoadComponent>
    )
  },
  {
    path: "/InventoryItemMaster",
    isExactPath: true,
    component: (
      <LoadComponent>
        <InventoryItemMaster />
      </LoadComponent>
    )
  },
  {
    path: "/MRDList",
    isExactPath: true,
    component: (
      <LoadComponent>
        <MRDList />
      </LoadComponent>
    )
  },
  {
    path: "/InvoiceGeneration",
    isExactPath: true,
    component: (
      <LoadComponent>
        <InvoiceGeneration />
      </LoadComponent>
    )
  },
  {
    path: "/ItemMomentEnquiry",
    isExactPath: true,
    component: (
      <LoadComponent>
        <ItemMomentEnquiry />
      </LoadComponent>
    )
  },
  {
    path: "/FrontDesk",
    isExactPath: true,
    component: (
      <LoadComponent>
        <PatientRegistration />
      </LoadComponent>
    )
  },
  {
    path: "/Appointment",
    isExactPath: true,
    component: (
      <LoadComponent>
        <FrontDesk screen="Appointment" />
      </LoadComponent>
    )
  },
  {
    path: "/UpdatePatientDetails",
    isExactPath: true,
    component: (
      <LoadComponent>
        <UpdatePatientDetails />
      </LoadComponent>
    )
  },
  {
    path: "/BusinessSetup",
    isExactPath: true,
    component: (
      <LoadComponent>
        <BusinessSetup />
      </LoadComponent>
    )
  },
  {
    path: "/CommonSetup",
    isExactPath: true,
    component: (
      <LoadComponent>
        <CommonSetup />
      </LoadComponent>
    )
  },
  {
    path: "/OPBilling",
    isExactPath: true,
    component: (
      <LoadComponent>
        <OPBilling />
      </LoadComponent>
    )
  },
  {
    path: "/BillDetails",
    isExactPath: true,
    component: (
      <LoadComponent>
        <BillDetails />
      </LoadComponent>
    )
  },
  {
    path: "/InsuranceSetup",
    isExactPath: true,
    component: (
      <LoadComponent>
        <InsuranceSetup />
      </LoadComponent>
    )
  },
  {
    path: "/SampleCollection",
    isExactPath: true,
    component: (
      <LoadComponent>
        <SampleCollection />
      </LoadComponent>
    )
  },
  {
    path: "/DoctorsWorkbench",
    isExactPath: true,
    component: (
      <LoadComponent>
        <DoctorsWorkbench />
      </LoadComponent>
    )
  },
  {
    path: "/NurseWorkbench",
    isExactPath: true,
    component: (
      <LoadComponent>
        <NurseWorkbench />
      </LoadComponent>
    )
  },
  {
    path: "/PatientPackages",
    isExactPath: true,
    component: (
      <LoadComponent>
        <PatientPackages />
      </LoadComponent>
    )
  },

  {
    path: "/PatientProfile",
    isExactPath: true,
    component: (
      <LoadComponent>
        <PatientProfile />
      </LoadComponent>
    )
  },
  {
    path: "/AcknowledgeList",
    isExactPath: true,
    component: (
      <LoadComponent>
        <AcknowledgeList />
      </LoadComponent>
    )
  },
  {
    path: "/ExpiringItemList",
    isExactPath: true,
    component: (
      <LoadComponent>
        <ExpiringItemList />
      </LoadComponent>
    )
  },
  {
    path: "/InvAcknowledgeList",
    isExactPath: true,
    component: (
      <LoadComponent>
        <InvAcknowledgeList />
      </LoadComponent>
    )
  },
  {
    path: "/MedicalWorkbenchSetup",
    isExactPath: true,
    component: (
      <LoadComponent>
        <MedicalWorkbenchSetup />
      </LoadComponent>
    )
  },
  {
    path: "/PharmacySetup",
    isExactPath: true,
    component: (
      <LoadComponent>
        <PharmacySetup />
      </LoadComponent>
    )
  },
  {
    path: "/ProcedureSetup",
    isExactPath: true,
    component: (
      <LoadComponent>
        <ProcedureSetup />
      </LoadComponent>
    )
  },
  {
    path: "/VendorSetup",
    isExactPath: true,
    component: (
      <LoadComponent>
        <VendorSetup />
      </LoadComponent>
    )
  },
  {
    path: "/CustomerSetup",
    isExactPath: true,
    component: (
      <LoadComponent>
        <CustomerSetup />
      </LoadComponent>
    )
  },
  {
    path: "/ERPSettings",
    isExactPath: true,
    component: (
      <LoadComponent>
        <ERPSettings />
      </LoadComponent>
    )
  },
  {
    path: "/SalesSetup",
    isExactPath: true,
    component: (
      <LoadComponent>
        <SalesSetup />
      </LoadComponent>
    )
  },
  {
    path: "/DayEndProcess",
    isExactPath: true,
    component: (
      <LoadComponent>
        <DayEndProcess />
      </LoadComponent>
    )
  },

  {
    path: "/FinanceMapping",
    isExactPath: true,
    component: (
      <LoadComponent>
        <FinanceFragment path="Mapping" />
      </LoadComponent>
    )
  },

  {
    path: "/CostCenter",
    isExactPath: true,
    component: (
      <LoadComponent>
        <FinanceFragment path="CostCenter" />
      </LoadComponent>
    )
  },

  {
    path: "/Accounts",
    isExactPath: true,
    component: (
      <LoadComponent>
        <FinanceFragment path="Accounts" />
      </LoadComponent>
    )
  },
  {
    path: "/Transactions",
    isExactPath: true,
    component: (
      <LoadComponent>
        <FinanceFragment path="Transactions" />
      </LoadComponent>
    )
  },
  {
    path: "/JournalVoucher",
    isExactPath: true,
    component: (
      <LoadComponent>
        <FinanceFragment path="JournalVoucher" />
      </LoadComponent>
    )
  },
  {
    path: "/FinanceReports",
    isExactPath: true,
    component: (
      <LoadComponent>
        <FinanceFragment path="FinanceReports" />
      </LoadComponent>
    )
  },
  {
    path: "/FinanceOptions",
    isExactPath: true,
    component: (
      <LoadComponent>
        <FinanceFragment path="FinanceOptions" />
      </LoadComponent>
    )
  },
  {
    path: "/NurseWorkbench",
    isExactPath: true,
    component: (
      <LoadComponent>
        <NurseWorkbench />
      </LoadComponent>
    )
  },
  {
    path: "/AdministrationSetup",
    isExactPath: true,
    component: (
      <LoadComponent>
        <AdministrationSetup />
      </LoadComponent>
    )
  },
  {
    path: "/OPBillCancellation",
    isExactPath: true,
    component: (
      <LoadComponent>
        <OPBillCancellation />
      </LoadComponent>
    )
  },
  {
    path: "/OPCreditSettlement",
    isExactPath: true,
    component: (
      <LoadComponent>
        <OPCreditSettlement />
      </LoadComponent>
    )
  },
  {
    path: "/POSCreditSettlement",
    isExactPath: true,
    component: (
      <LoadComponent>
        <POSCreditSettlement />
      </LoadComponent>
    )
  },
  {
    path: "/StockAdjustment",
    isExactPath: true,
    component: (
      <LoadComponent>
        <StockAdjustment />
      </LoadComponent>
    )
  },
  {
    path: "/SelfService",
    isExactPath: true,
    component: (
      <LoadComponent>
        <SelfService />
      </LoadComponent>
    )
  },
  {
    path: "/EmpServ",
    isExactPath: true,
    component: (
      <LoadComponent>
        <EmpServ />
      </LoadComponent>
    )
  },
  {
    path: "/AttendanceRegularization",
    isExactPath: true,
    component: (
      <LoadComponent>
        <AttendanceRegularization />
      </LoadComponent>
    )
  },
  {
    path: "/PayrollSettings",
    isExactPath: true,
    component: (
      <LoadComponent>
        <PayrollSettings />
      </LoadComponent>
    )
  },
  {
    path: "/SalaryManagement",
    isExactPath: true,
    component: (
      <LoadComponent>
        <SalaryManagement />
      </LoadComponent>
    )
  },
  {
    path: "/HolidayMgmnt",
    isExactPath: true,
    component: (
      <LoadComponent>
        <HolidayMgmnt />
      </LoadComponent>
    )
  },
  {
    path: "/HRSettings",
    isExactPath: true,
    component: (
      <LoadComponent>
        <HRSettings />
      </LoadComponent>
    )
  },
  {
    path: "/LeaveManagement",
    isExactPath: true,
    component: (
      <LoadComponent>
        <LeaveManagement />
      </LoadComponent>
    )
  },
  {
    path: "/AttendanceManagement",
    isExactPath: true,
    component: (
      <LoadComponent>
        <AttendanceManagement />
      </LoadComponent>
    )
  },
  {
    path: "/ExitManagement",
    isExactPath: true,
    component: (
      <LoadComponent>
        <ExitManagement />
      </LoadComponent>
    )
  },
  {
    path: "/PayrollSettings",
    isExactPath: true,
    component: (
      <LoadComponent>
        <PayrollSettings />
      </LoadComponent>
    )
  },
  {
    path: "/LoanManagement",
    isExactPath: true,
    component: (
      <LoadComponent>
        <LoanManagement />
      </LoadComponent>
    )
  },
  {
    path: "/PayrollWorkBench",
    isExactPath: true,
    component: (
      <LoadComponent>
        <PayrollWorkBench />
      </LoadComponent>
    )
  },
  {
    path: "/PerformanceManagement",
    isExactPath: true,
    component: (
      <LoadComponent>
        <PerformanceManagement />
      </LoadComponent>
    )
  },
  {
    path: "/EmployeeDocuments",
    isExactPath: true,
    component: (
      <LoadComponent>
        <EmployeeDocuments />
      </LoadComponent>
    )
  },
  {
    path: "/PayrollOptions",
    isExactPath: true,
    component: (
      <LoadComponent>
        <PayrollOptions />
      </LoadComponent>
    )
  },
  {
    path: "/ClinicalDeskNew",
    isExactPath: true,
    component: (
      <LoadComponent>
        <ClinicalDeskNew />
      </LoadComponent>
    )
  },
  {
    path: "/EmpShiftRost",
    isExactPath: true,
    component: (
      <LoadComponent>
        <EmpShiftRost />
      </LoadComponent>
    )
  },
  {
    path: "/Wps",
    isExactPath: true,
    component: (
      <LoadComponent>
        <Wps />
      </LoadComponent>
    )
  },
  {
    path: "/ProjJobCst",
    isExactPath: true,
    component: (
      <LoadComponent>
        <ProjJobCst />
      </LoadComponent>
    )
  },
  {
    path: "/OrgChart",
    isExactPath: true,
    component: (
      <LoadComponent>
        <OrgChart />
      </LoadComponent>
    )
  },
  {
    path: "/AppSetup",
    isExactPath: true,
    component: (
      <LoadComponent>
        <AppSetup />
      </LoadComponent>
    )
  },
  {
    path: "/PackageSetup",
    isExactPath: true,
    component: (
      <LoadComponent>
        <PackageSetup />
      </LoadComponent>
    )
  },
  {
    path: "/FavouriteOrderList",
    isExactPath: true,
    component: (
      <LoadComponent>
        <FavouriteOrderList />
      </LoadComponent>
    )
  },
  {
    path: "/PackageBilling",
    isExactPath: true,
    component: (
      <LoadComponent>
        <PackageBilling />
      </LoadComponent>
    )
  },
  {
    path: "/DiagramMaster",
    isExactPath: true,
    component: (
      <LoadComponent>
        <DiagramMaster />
      </LoadComponent>
    )
  },
  {
    path: "/PhysioTherapy",
    isExactPath: true,
    component: (
      <LoadComponent>
        <PhysioTherapy />
      </LoadComponent>
    )
  },
  {
    path: "/DentalLab",
    isExactPath: true,
    component: (
      <LoadComponent>
        <DentalLab />
      </LoadComponent>
    )
  },
  {
    path: "/SalesQuotation",
    isExactPath: true,
    component: (
      <LoadComponent>
        <SalesQuotation />
      </LoadComponent>
    )
  },
  {
    path: "/SalesOrder",
    isExactPath: true,
    component: (
      <LoadComponent>
        <SalesOrder />
      </LoadComponent>
    )
  },
  {
    path: "/DispatchNote",
    isExactPath: true,
    component: (
      <LoadComponent>
        <DispatchNote />
      </LoadComponent>
    )
  },
  {
    path: "/ContractManagement",
    isExactPath: true,
    component: (
      <LoadComponent>
        <ContractManagement />
      </LoadComponent>
    )
  },
  {
    path: "/SalesInvoice",
    isExactPath: true,
    component: (
      <LoadComponent>
        <SalesInvoice />
      </LoadComponent>
    )
  },
  {
    path: "/SalesQuotationList",
    isExactPath: true,
    component: (
      <LoadComponent>
        <SalesQuotationList />
      </LoadComponent>
    )
  },
  {
    path: "/SalesOrderList",
    isExactPath: true,
    component: (
      <LoadComponent>
        <SalesOrderList />
      </LoadComponent>
    )
  },

  {
    path: "/PatientRecall",
    isExactPath: true,
    component: (
      <LoadComponent>
        <PatientRecall />
      </LoadComponent>
    )
  },

  {
    path: "/StaffCashCollection",
    isExactPath: true,
    component: (
      <LoadComponent>
        <StaffCashCollection />
      </LoadComponent>
    )
  },

  {
    path: "/PhysicianScheduleSetup",
    isExactPath: true,
    component: (
      <LoadComponent>
        <PhysicianScheduleSetup />
      </LoadComponent>
    )
  },

  {
    path: "/VisitClose",
    isExactPath: true,
    component: (
      <LoadComponent>
        <VisitClose />
      </LoadComponent>
    )
  },

  {
    path: "/OPBillPendingList",
    isExactPath: true,
    component: (
      <LoadComponent>
        <OPBillPendingList />
      </LoadComponent>
    )
  },

  {
    path: "/AccessionAcknowledgement",
    isExactPath: true,
    component: (
      <LoadComponent>
        <AccessionAcknowledgement />
      </LoadComponent>
    )
  },

  {
    path: "/ResultEntryList",
    isExactPath: true,
    component: (
      <LoadComponent>
        <ResultEntryList />
      </LoadComponent>
    )
  },

  {
    path: "/RadOrderedList",
    isExactPath: true,
    component: (
      <LoadComponent>
        <RadOrderedList />
      </LoadComponent>
    )
  },

  {
    path: "/RadScheduledList",
    isExactPath: true,
    component: (
      <LoadComponent>
        <RadScheduledList />
      </LoadComponent>
    )
  },

  {
    path: "/PreApproval",
    isExactPath: true,
    component: (
      <LoadComponent>
        <PreApproval />
      </LoadComponent>
    )
  },

  {
    path: "/WorkListGeneration",
    isExactPath: true,
    component: (
      <LoadComponent>
        <WorkListGeneration />
      </LoadComponent>
    )
  },

  {
    path: "/RCMWorkbench",
    isExactPath: true,
    component: (
      <LoadComponent>
        <RCMWorkbench />
      </LoadComponent>
    )
  },
  {
    path: "/InitialStock",
    isExactPath: true,
    component: (
      <LoadComponent>
        <InitialStock />
      </LoadComponent>
    )
  },
  {
    path: "/InvInitialStock",
    isExactPath: true,
    component: (
      <LoadComponent>
        <InvInitialStock />
      </LoadComponent>
    )
  },
  {
    path: "/InvStockEnquiry",
    isExactPath: true,
    component: (
      <LoadComponent>
        <InvStockEnquiry />
      </LoadComponent>
    )
  },
  {
    path: "/InvItemMomentEnquiry",
    isExactPath: true,
    component: (
      <LoadComponent>
        <InvItemMomentEnquiry />
      </LoadComponent>
    )
  },
  {
    path: "/InvRequisitionEntry",
    isExactPath: true,
    component: (
      <LoadComponent>
        <InvRequisitionEntry />
      </LoadComponent>
    )
  },
  {
    path: "/InvRequisitionList",
    isExactPath: true,
    component: (
      <LoadComponent>
        <InvRequisitionList />
      </LoadComponent>
    )
  },
  {
    path: "/InvTransferEntry",
    isExactPath: true,
    component: (
      <LoadComponent>
        <InvTransferEntry />
      </LoadComponent>
    )
  },
  {
    path: "/SalesReturn",
    isExactPath: true,
    component: (
      <LoadComponent>
        <SalesReturn />
      </LoadComponent>
    )
  },
  {
    path: "/PrescriptionList",
    isExactPath: true,
    component: (
      <LoadComponent>
        <PrescriptionList />
      </LoadComponent>
    )
  },
  {
    path: "/StockEnquiry",
    isExactPath: true,
    component: (
      <LoadComponent>
        <StockEnquiry />
      </LoadComponent>
    )
  },

  {
    path: "/InvConsumptionEntry",
    isExactPath: true,
    component: (
      <LoadComponent>
        <InvConsumptionEntry />
      </LoadComponent>
    )
  },
  {
    path: "/InvPointOfSale",
    isExactPath: true,
    component: (
      <LoadComponent>
        <InvPointOfSale />
      </LoadComponent>
    )
  },
  {
    path: "/PurchaseOrderEntry",
    isExactPath: true,
    component: (
      <LoadComponent>
        <PurchaseOrderEntry />
      </LoadComponent>
    )
  },
  {
    path: "/PurchaseReturnEntry",
    isExactPath: true,
    component: (
      <LoadComponent>
        <PurchaseReturnEntry />
      </LoadComponent>
    )
  },
  {
    path: "/PurchaseOrderList",
    isExactPath: true,
    component: (
      <LoadComponent>
        <PurchaseOrderList />
      </LoadComponent>
    )
  },
  {
    path: "/DeliveryNoteEntry",
    isExactPath: true,
    component: (
      <LoadComponent>
        <DeliveryNoteEntry />
      </LoadComponent>
    )
  },
  {
    path: "/ReceiptEntry",
    isExactPath: true,
    component: (
      <LoadComponent>
        <ReceiptEntry />
      </LoadComponent>
    )
  },
  {
    path: "/ShipmentEntry",
    isExactPath: true,
    component: (
      <LoadComponent>
        <ShipmentEntry />
      </LoadComponent>
    )
  },
  {
    path: "/RequestForQuotation",
    isExactPath: true,
    component: (
      <LoadComponent>
        <RequestForQuotation />
      </LoadComponent>
    )
  },
  {
    path: "/InvStockAdjustment",
    isExactPath: true,
    component: (
      <LoadComponent>
        <InvStockAdjustment />
      </LoadComponent>
    )
  },
  {
    path: "/EmployeeMasterIndex",
    isExactPath: true,
    component: (
      <LoadComponent>
        <EmployeeMasterIndex />
      </LoadComponent>
    )
  },
  {
    path: "/VendorsQuotation",
    isExactPath: true,
    component: (
      <LoadComponent>
        <VendorsQuotation />
      </LoadComponent>
    )
  },
  {
    path: "/QuotationCompare",
    isExactPath: true,
    component: (
      <LoadComponent>
        <QuotationCompare />
      </LoadComponent>
    )
  },
  {
    path: "/DoctorCommission",
    isExactPath: true,
    component: (
      <LoadComponent>
        <DoctorCommission />
      </LoadComponent>
    )
  },
  {
    path: "/DoctorCommission",
    isExactPath: true,
    component: (
      <LoadComponent>
        <DoctorCommission />
      </LoadComponent>
    )
  },
  {
    path: "/RequisitionEntry",
    isExactPath: true,
    component: (
      <LoadComponent>
        <RequisitionEntry />
      </LoadComponent>
    )
  },
  {
    path: "/RequisitionList",
    isExactPath: true,
    component: (
      <LoadComponent>
        <RequisitionList />
      </LoadComponent>
    )
  },
  {
    path: "/ReportsList",
    isExactPath: true,
    component: (
      <LoadComponent>
        <ReportsList />
      </LoadComponent>
    )
  },
  {
    path: "/TransferEntry",
    isExactPath: true,
    component: (
      <LoadComponent>
        <TransferEntry />
      </LoadComponent>
    )
  },
  {
    path: "/ConsumptionEntry",
    isExactPath: true,
    component: (
      <LoadComponent>
        <ConsumptionEntry />
      </LoadComponent>
    )
  },

  {
    path: "/JournalAuthorization",
    isExactPath: true,
    component: (
      <LoadComponent>
        <FinanceFragment path="JournalAuthorization" />
      </LoadComponent>
    )
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
  }
];

const routes = (
  <BrowserRouter>
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
  </BrowserRouter>
);

export default routes;
