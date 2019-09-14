import React from "react";
import hasIn from "lodash/hasIn";
import { retry } from "./utils/GlobalFunctions";
import PrescriptionList from "./Components/Pharmacy/PrescriptionList/PrescriptionList";
import StockEnquiry from "./Components/Pharmacy/StockEnquiry/StockEnquiry";
import ItemSetup from "./Components/ItemSetup/ItemSetup";
import Appointment from "./Components/FrontDesk/FrontDesk";
import InitialStock from "./Components/Pharmacy/InitialStock/InitialStock";
import ResultEntryList from "./Components/Laboratory/ResultEntryList/ResultEntryList";
import RequisitionEntry from "./Components/Pharmacy/RequisitionEntry/RequisitionEntry";
import TransferEntry from "./Components/Pharmacy/TransferEntry/TransferEntry";
import ReportsList from "./Components/Reports/Reports";
import RCMWorkbench from "./Components/InsuranceClaims/RCMWorkbench/RCMWorkbench";
import VisitClose from "./Components/VisitClose/VisitClose";
import AlgaehModules from "./Components/Algaeh/Algaeh";
import PointOfSale from "./Components/Pharmacy/PointOfSale/PointOfSale";
import MRDList from "./Components/MRD/MRD";
import InvoiceGeneration from "./Components/InsuranceClaims/InvoiceGeneration/InvoiceGeneration";
import ItemMomentEnquiry from "./Components/Pharmacy/ItemMomentEnquiry/ItemMomentEnquiry";
import DoctorsWorkbench from "./Components/Workbench/Workbench";
import NurseWorkbench from "./Components/Workbench/Workbench";
import CommonDashboard from "./Components/Dashboard/Dashboard";
import PatientPackages from "./Components/PatientPackages/PatientPackages";
import AcknowledgeList from "./Components/Pharmacy/AcknowledgeList/AcknowledgeSwitch";
import ExpiringItemList from "./Components/Pharmacy/ExpiringItemList/ExpiringItemList";
import InvAcknowledgeList from "./Components/Inventory/InvAcknowledgeList/InvAcknowledgeSwitch";
import DynamicDashboard from "./Components/Dashboard/dynamicDashboard";
const PageToPlot = {
  // Dashboard: CommonDashboard,
  Dashboard: DynamicDashboard,
  7: React.lazy(() =>
    retry(() => import("./Components/Dashboard/frontdesk-dashboard"))
  ),
  8: React.lazy(() =>
    retry(() => import("./Components/Dashboard/doctor-dashboard"))
  ),
  11: React.lazy(() =>
    retry(() => import("./Components/Dashboard/lab-dashboard"))
  ),
  12: React.lazy(() =>
    retry(() => import("./Components/Dashboard/hr-dashboard"))
  ),
  13: React.lazy(() =>
    retry(() => import("./Components/Dashboard/pharmacy-dashboard"))
  ),
  14: React.lazy(() =>
    retry(() => import("./Components/Dashboard/inventory-dashboard"))
  ),
  FrontDesk: React.lazy(() =>
    retry(() => import("./Components/RegistrationPatient/RegistrationPatient"))
  ),
  UpdatePatientDetails: React.lazy(() =>
    retry(() =>
      import("./Components/UpdatePatientDetails/UpdatePatientDetails")
    )
  ),

  BusinessSetup: React.lazy(() =>
    retry(() => import("./Components/BusinessSetup/BusinessSetup"))
  ),
  CommonSetup: React.lazy(() =>
    retry(() => import("./Components/CommonSetup/CommonSetup"))
  ),
  OPBilling: React.lazy(() =>
    retry(() => import("./Components/OPBilling/OPBilling"))
  ),
  BillDetails: React.lazy(() =>
    retry(() => import("./Components/BillDetails/BillDetails"))
  ),
  InsuranceSetup: React.lazy(() =>
    retry(() => import("./Components/InsuranceSetup/InsuranceSetup"))
  ),
  SampleCollection: React.lazy(() =>
    retry(() =>
      import("./Components/Laboratory/SampleCollection/SampleCollection")
    )
  ),
  // DoctorsWorkbench: React.lazy(() =>
  //   retry(() => import("./Components/Workbench/Workbench"))
  // ),
  DoctorsWorkbench: DoctorsWorkbench,
  NurseWorkbench: NurseWorkbench,
  // NurseWorkbench: React.lazy(() =>
  //   retry(() => import("./Components/Workbench/Workbench"))
  // ),
  MedicalWorkbenchSetup: React.lazy(() =>
    retry(() =>
      import("./Components/MedicalWorkbenchSetup/MedicalWorkbenchSetup")
    )
  ),
  AccessionAcknowledgement: React.lazy(() =>
    retry(() =>
      import(
        "./Components/Laboratory/AccessionAcknowledgement/AccessionAcknowledgement"
      )
    )
  ),
  PreApproval: React.lazy(() =>
    retry(() => import("./Components/PreApproval/PreApproval"))
  ),
  LabSetup: React.lazy(() =>
    retry(() => import("./Components/LabSetup/LabSetup"))
  ),
  InvestigationSetup: React.lazy(() =>
    retry(() => import("./Components/InvestigationSetup/InvestigationSetup"))
  ),
  RadOrderedList: React.lazy(() =>
    retry(() => import("./Components/Radiology/RadOrderedList/RadOrderedList"))
  ),
  RadScheduledList: React.lazy(() =>
    retry(() =>
      import("./Components/Radiology/RadScheduledList/RadScheduledList")
    )
  ),
  // ResultEntryList: React.lazy(() =>
  //   retry(() =>
  //     import("./Components/Laboratory/ResultEntryList/ResultEntryList")
  //   )
  // ),

  // InitialStock: React.lazy(() =>
  //   retry(() => import("./Components/Pharmacy/InitialStock/InitialStock"))
  // ),
  ResultEntryList: ResultEntryList,
  InitialStock: InitialStock,
  PrescriptionList: PrescriptionList,
  PatientPackages: PatientPackages,
  ExpiringItemList: ExpiringItemList,
  // PrescriptionList: React.lazy(() =>
  //   retry(() =>
  //     import("./Components/Pharmacy/PrescriptionList/PrescriptionList")
  //   )
  // ),
  // Appointment: React.lazy(() =>
  //   retry(() => import("./Components/FrontDesk/FrontDesk"))
  // ),
  Appointment: Appointment,
  PharmacySetup: React.lazy(() =>
    retry(() => import("./Components/PharmacySetup/PharmacySetup"))
  ),
  // StockEnquiry: React.lazy(() =>
  //   retry(() => import("./Components/Pharmacy/StockEnquiry/StockEnquiry"))
  // ),
  StockEnquiry: StockEnquiry,
  // ItemMomentEnquiry: React.lazy(() =>
  //   retry(() =>
  //     import("./Components/Pharmacy/ItemMomentEnquiry/ItemMomentEnquiry")
  //   )
  // ),
  ItemMomentEnquiry: ItemMomentEnquiry,
  AppointmentSetup: React.lazy(() =>
    retry(() => import("./Components/AppointmentSetup/AppointmentSetup"))
  ),
  // ItemSetup: React.lazy(() =>
  //   retry(() => import("./Components/ItemSetup/ItemSetup"))
  // ),
  ItemSetup: ItemSetup,
  EmployeeMasterIndex: React.lazy(() =>
    retry(() =>
      import(
        "./Components/EmployeeManagement/EmployeeMasterIndex/EmployeeMasterIndex"
      )
    )
  ),
  PhysicianScheduleSetup: React.lazy(() =>
    retry(() => import("./Components/PhysicianScheduleSetup/PhySchSetup"))
  ),
  // FrontDeskAr: React.lazy(() =>
  //   retry(() =>
  //     import("./Components/RegistrationPatientAr/RegistrationPatientAr")
  //   )
  // ),
  // OPBillingAr: React.lazy(() =>
  //   retry(() => import("./Components/OPBillingAr/OPBillingAr"))
  // ),
  DoctorCommission: React.lazy(() =>
    retry(() => import("./Components/DoctorCommission/DoctorCommission"))
  ),
  HospitalServiceSetup: React.lazy(() =>
    retry(() =>
      import("./Components/HospitalServiceSetup/HospitalServiceSetup")
    )
  ),
  PointOfSale: PointOfSale,
  // PointOfSale: React.lazy(() =>
  //   retry(() => import("./Components/Pharmacy/PointOfSale/PointOfSale"))
  // ),
  OPBillPendingList: React.lazy(() =>
    retry(() => import("./Components/OPBillPendingList/OPBillPendingList"))
  ),
  MRDList: MRDList,
  // MRDList: React.lazy(() => retry(() => import("./Components/MRD/MRD"))),
  SalesReturn: React.lazy(() =>
    retry(() => import("./Components/Pharmacy/SalesReturn/SalesReturn"))
  ),
  // RequisitionEntry: React.lazy(() =>
  //   retry(() =>
  //     import("./Components/Pharmacy/RequisitionEntry/RequisitionEntry")
  //   )
  // ),
  RequisitionEntry: RequisitionEntry,
  ProcedureSetup: React.lazy(() =>
    retry(() => import("./Components/ProcedureSetup/ProcedureSetup"))
  ),
  // TransferEntry: React.lazy(() =>
  //   retry(() => import("./Components/Pharmacy/TransferEntry/TransferEntry"))
  // ),
  TransferEntry: TransferEntry,
  RequisitionList: React.lazy(() =>
    retry(() =>
      import("./Components/Pharmacy/RequisitionList/RequisitionSwitch")
    )
  ),
  AcknowledgeList: AcknowledgeList,
  ConsumptionEntry: React.lazy(() =>
    retry(() =>
      import("./Components/Pharmacy/ConsumptionEntry/ConsumptionEntry")
    )
  ),
  // ReportsList: React.lazy(() =>
  //   retry(() => import("./Components/Reports/Reports"))
  // ),
  ReportsList: ReportsList,
  WorkListGeneration: React.lazy(() =>
    retry(() =>
      import(
        "./Components/InsuranceClaims/WorkListGeneration/WorkListGeneration"
      )
    )
  ),
  // RCMWorkbench: React.lazy(() =>
  //   retry(() =>
  //     import("./Components/InsuranceClaims/RCMWorkbench/RCMWorkbench")
  //   )
  // ),
  RCMWorkbench: RCMWorkbench,
  StaffCashCollection: React.lazy(() =>
    retry(() => import("./Components/StaffCashCollection/StaffCashCollection"))
  ),
  // InvoiceGeneration: React.lazy(() =>
  //   retry(() =>
  //     import("./Components/InsuranceClaims/InvoiceGeneration/InvoiceGeneration")
  //   )
  // ),
  InvoiceGeneration: InvoiceGeneration,
  InventorySetup: React.lazy(() =>
    retry(() => import("./Components/InventorySetup/InventorySetup"))
  ),
  InventoryItemMaster: React.lazy(() =>
    retry(() => import("./Components/InventoryItemMaster/InventoryItemMaster"))
  ),
  InvInitialStock: React.lazy(() =>
    retry(() =>
      import("./Components/Inventory/InvInitialStock/InvInitialStock")
    )
  ),
  InvStockEnquiry: React.lazy(() =>
    retry(() =>
      import("./Components/Inventory/InvStockEnquiry/InvStockEnquiry")
    )
  ),
  InvItemMomentEnquiry: React.lazy(() =>
    retry(() =>
      import("./Components/Inventory/InvItemMomentEnquiry/InvItemMomentEnquiry")
    )
  ),
  InvRequisitionEntry: React.lazy(() =>
    retry(() =>
      import("./Components/Inventory/InvRequisitionEntry/InvRequisitionEntry")
    )
  ),
  InvRequisitionList: React.lazy(() =>
    retry(() =>
      import("./Components/Inventory/InvRequisitionList/InvRequisitionSwitch")
    )
  ),
  InvTransferEntry: React.lazy(() =>
    retry(() =>
      import("./Components/Inventory/InvTransferEntry/InvTransferEntry")
    )
  ),
  InvConsumptionEntry: React.lazy(() =>
    retry(() =>
      import("./Components/Inventory/InvConsumptionEntry/InvConsumptionEntry")
    )
  ),
  InvPointOfSale: React.lazy(() =>
    retry(() => import("./Components/Inventory/InvPointOfSale/InvPointOfSale"))
  ),
  InvAcknowledgeList: InvAcknowledgeList,
  VendorSetup: React.lazy(() =>
    retry(() => import("./Components/VendorSetup/VendorSetup"))
  ),
  DayEndProcess: React.lazy(() =>
    retry(() => import("./Components/Finance/DayEndProcess/DayEndProcess"))
  ),
  FinanceMapping: React.lazy(() =>
    retry(() => import("./Components/Finance/FinanceMapping/FinanceMapping"))
  ),
  DeliveryNoteEntry: React.lazy(() =>
    retry(() =>
      import("./Components/Procurement/DeliveryNoteEntry/DeliveryNoteEntry")
    )
  ),
  PurchaseOrderEntry: React.lazy(() =>
    retry(() =>
      import("./Components/Procurement/PurchaseOrderEntry/PurchaseOrderEntry")
    )
  ),
  ReceiptEntry: React.lazy(() =>
    retry(() => import("./Components/Procurement/ReceiptEntry/ReceiptEntry"))
  ),
  ShipmentEntry: React.lazy(() =>
    retry(() => import("./Components/Procurement/ShipmentEntry/ShipmentEntry"))
  ),
  AcquisitionEntry: React.lazy(() =>
    retry(() =>
      import("./Components/AssetManagement/AcquisitionEntry/AcquisitionEntry")
    )
  ),
  DepreciationEntry: React.lazy(() =>
    retry(() =>
      import("./Components/AssetManagement/DepreciationEntry/DepreciationEntry")
    )
  ),
  DepreciationReversal: React.lazy(() =>
    retry(() =>
      import(
        "./Components/AssetManagement/DepreciationReversal/DepreciationReversal"
      )
    )
  ),
  Disposal: React.lazy(() =>
    retry(() => import("./Components/AssetManagement/Disposal/Disposal"))
  ),
  PurchaseOrderList: React.lazy(() =>
    retry(() =>
      import("./Components/Procurement/PurchaseOrderList/PurchaseSwitch")
    )
  ),
  PatientRecall: React.lazy(() =>
    retry(() => import("./Components/PatientRecall/PatientRecall"))
  ),
  AdministrationSetup: React.lazy(() =>
    retry(() => import("./Components/AdministrationSetup/AdminSetup"))
  ),
  OPBillCancellation: React.lazy(() =>
    retry(() => import("./Components/OPBillCancellation/OPBillCancellation"))
  ),
  OPCreditSettlement: React.lazy(() =>
    retry(() => import("./Components/OPCreditSettlement/OPCreditSettlement"))
  ),
  POSCreditSettlement: React.lazy(() =>
    retry(() =>
      import("./Components/Pharmacy/POSCreditSettlement/POSCreditSettlement")
    )
  ),
  // VisitClose: React.lazy(() =>
  //   retry(() => import("./Components/VisitClose/VisitClose"))
  // ),
  VisitClose: VisitClose,
  AlgaehModules: AlgaehModules,
  // AlgaehModules: React.lazy(() =>
  //   retry(() => import("./Components/Algaeh/Algaeh"))
  // ),
  SelfService: React.lazy(() =>
    retry(() =>
      import("./Components/EmployeeManagement/SelfService/SelfService")
    )
  ),
  EmpServ: React.lazy(() =>
    retry(() =>
      import(
        "./Components/EmployeeManagement/EmployeeServices/EmployeeServices"
      )
    )
  ),
  AttendanceRegularization: React.lazy(() =>
    retry(() =>
      import(
        "./Components/EmployeeManagement/AttendanceRegularization/AttendanceRegularization"
      )
    )
  ),
  PayrollSettings: React.lazy(() =>
    retry(() =>
      import("./Components/PayrollManagement/PayrollSettings/PayrollSettings")
    )
  ),
  SalaryManagement: React.lazy(() =>
    retry(() =>
      import("./Components/PayrollManagement/SalaryManagement/SalaryManagement")
    )
  ),
  HolidayMgmnt: React.lazy(() =>
    retry(() =>
      import("./Components/PayrollManagement/HolidayManagement/HolidayMgmnt")
    )
  ),
  HRSettings: React.lazy(() =>
    retry(() => import("./Components/EmployeeManagement/HRSettings/HRSettings"))
  ),
  LeaveManagement: React.lazy(() =>
    retry(() =>
      import("./Components/PayrollManagement/LeaveManagement/LeaveManagement")
    )
  ),
  AttendanceManagement: React.lazy(() =>
    retry(() =>
      import("./Components/PayrollManagement/AttendanceMgmt/AttendanceMgmt")
    )
  ),
  ExitManagement: React.lazy(() =>
    retry(() =>
      import("./Components/PayrollManagement/ExitManagement/ExitManagement")
    )
  ),
  LoanManagement: React.lazy(() =>
    retry(() =>
      import("./Components/PayrollManagement/LoanManagement/LoanManagement")
    )
  ),
  PayrollWorkBench: React.lazy(() =>
    retry(() =>
      import("./Components/PayrollManagement/PayrollWorkbench/PayrollWorkbench")
    )
  ),
  PerformanceManagement: React.lazy(() =>
    retry(() =>
      import(
        "./Components/PayrollManagement/PerformanceManagement/PerformanceManagement"
      )
    )
  ),
  EmployeeDocuments: React.lazy(() =>
    retry(() =>
      import(
        "./Components/EmployeeManagement/EmployeeDocuments/EmployeeDocuments"
      )
    )
  ),
  PayrollOptions: React.lazy(() =>
    retry(() =>
      import("./Components/PayrollManagement/PayrollOptions/PayrollOptions")
    )
  ),
  ClinicalDeskNew: React.lazy(() =>
    retry(() => import("./Components/DoctorsWorkbench/DoctorsWorkbench-new"))
  ),
  EmpShiftRost: React.lazy(() =>
    retry(() =>
      import(
        "./Components/EmployeeManagement/EmployeeShiftRostering/EmployeeShiftRostering"
      )
    )
  ),
  Wps: React.lazy(() =>
    retry(() => import("./Components/PayrollManagement/WPS/WPS"))
  ),

  ProjJobCst: React.lazy(() =>
    retry(() =>
      import("./Components/EmployeeManagement/ProjectJobCost/ProjectJobCost")
    )
  ),
  OrgChart: React.lazy(() =>
    retry(() => import("./Components/OrgChart/OrgChart"))
  ),
  AppSetup: React.lazy(() =>
    retry(() => import("./Components/AppSetup/AppSetup"))
  ),
  PackageSetup: React.lazy(() =>
    retry(() => import("./Components/PackageSetup/PackageSetup"))
  ),

  FavouriteOrderList: React.lazy(() =>
    retry(() => import("./Components/FavouriteOrderList/FavouriteOrderList"))
  ),
  PackageBilling: React.lazy(() =>
    retry(() => import("./Components/PackageBilling/PackageBilling"))
  ),
  DiagramMaster: React.lazy(() =>
    retry(() => import("./Components/DiagramMaster/DiagramMaster"))
  ),
  PhysioTherapy: React.lazy(() =>
    retry(() => import("./Components/PhysioTherapy/PhysioTherapy"))
  ),
  DentalLab: React.lazy(() =>
    retry(() => import("./Components/Laboratory/DentalLab/DentalLab"))
  )
};

const DirectRoutes = React.memo(props => {
  let PlotPage = PageToPlot[props.componet];
  if (props.componet === "Dashboard") {
    const appRole = sessionStorage.getItem("appRole");
    if (appRole !== undefined) {
      const filter = hasIn(PageToPlot, appRole);
      if (filter === true) {
        PlotPage = PageToPlot[appRole];
      }
    }
  }
  return (
    <React.Suspense
      fallback={
        <div className="loader-container">
          <div className="algaeh-progress float shadow">
            <div className="progress__item">loading</div>
          </div>
        </div>
      }
    >
      <PlotPage {...props} />
    </React.Suspense>
  );

  // AlgaehLoader({ show: false });
  // return ;
});

export default DirectRoutes;
