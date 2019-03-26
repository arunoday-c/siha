import React from "react";

import { retry } from "./utils/GlobalFunctions";
const PageToPlot = {
  Dashboard: React.lazy(() =>
    retry(() => import("./Components/Dashboard/Dashboard"))
  ),
  FrontDesk: React.lazy(() =>
    retry(() => import("./Components/RegistrationPatient/RegistrationPatient"))
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
  DoctorsWorkbench: React.lazy(() =>
    retry(() => import("./Components/Workbench/Workbench"))
  ),
  NurseWorkbench: React.lazy(() =>
    retry(() => import("./Components/Workbench/Workbench"))
  ),
  MedicalWorkbenchSetup: React.lazy(() =>
    retry(() =>
      import("./Components/MedicalWorkbenchSetup/MedicalWorkbenchSetup")
    )
  ),
  AccessionAcknowledgement: React.lazy(() =>
    retry(() =>
      import("./Components/Laboratory/AccessionAcknowledgement/AccessionAcknowledgement")
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
  ResultEntryList: React.lazy(() =>
    retry(() =>
      import("./Components/Laboratory/ResultEntryList/ResultEntryList")
    )
  ),
  InitialStock: React.lazy(() =>
    retry(() => import("./Components/Pharmacy/InitialStock/InitialStock"))
  ),
  PrescriptionList: React.lazy(() =>
    retry(() =>
      import("./Components/Pharmacy/PrescriptionList/PrescriptionList")
    )
  ),
  Appointment: React.lazy(() =>
    retry(() => import("./Components/FrontDesk/FrontDesk"))
  ),
  AppointmentAr: React.lazy(() =>
    retry(() => import("./Components/AppointmentAr/AppointmentAr"))
  ),
  PharmacySetup: React.lazy(() =>
    retry(() => import("./Components/PharmacySetup/PharmacySetup"))
  ),
  StockEnquiry: React.lazy(() =>
    retry(() => import("./Components/Pharmacy/StockEnquiry/StockEnquiry"))
  ),
  ItemMomentEnquiry: React.lazy(() =>
    retry(() =>
      import("./Components/Pharmacy/ItemMomentEnquiry/ItemMomentEnquiry")
    )
  ),
  AppointmentSetup: React.lazy(() =>
    retry(() => import("./Components/AppointmentSetup/AppointmentSetup"))
  ),
  ItemSetup: React.lazy(() =>
    retry(() => import("./Components/ItemSetup/ItemSetup"))
  ),
  EmployeeMasterIndex: React.lazy(() =>
    retry(() =>
      import("./Components/EmployeeManagement/EmployeeMasterIndex/EmployeeMasterIndex")
    )
  ),
  PhysicianScheduleSetup: React.lazy(() =>
    retry(() => import("./Components/PhysicianScheduleSetup/PhySchSetup"))
  ),
  FrontDeskAr: React.lazy(() =>
    retry(() =>
      import("./Components/RegistrationPatientAr/RegistrationPatientAr")
    )
  ),
  OPBillingAr: React.lazy(() =>
    retry(() => import("./Components/OPBillingAr/OPBillingAr"))
  ),
  DoctorCommission: React.lazy(() =>
    retry(() => import("./Components/DoctorCommission/DoctorCommission"))
  ),
  HospitalServiceSetup: React.lazy(() =>
    retry(() =>
      import("./Components/HospitalServiceSetup/HospitalServiceSetup")
    )
  ),
  PointOfSale: React.lazy(() =>
    retry(() => import("./Components/Pharmacy/PointOfSale/PointOfSale"))
  ),
  OPBillPendingList: React.lazy(() =>
    retry(() => import("./Components/OPBillPendingList/OPBillPendingList"))
  ),
  MRDList: React.lazy(() => retry(() => import("./Components/MRD/MRD"))),
  SalesReturn: React.lazy(() =>
    retry(() => import("./Components/Pharmacy/SalesReturn/SalesReturn"))
  ),
  RequisitionEntry: React.lazy(() =>
    retry(() =>
      import("./Components/Pharmacy/RequisitionEntry/RequisitionEntry")
    )
  ),
  ProcedureSetup: React.lazy(() =>
    retry(() => import("./Components/ProcedureSetup/ProcedureSetup"))
  ),
  TransferEntry: React.lazy(() =>
    retry(() => import("./Components/Pharmacy/TransferEntry/TransferEntry"))
  ),
  RequisitionList: React.lazy(() =>
    retry(() =>
      import("./Components/Pharmacy/RequisitionList/RequisitionSwitch")
    )
  ),
  ReportsList: React.lazy(() =>
    retry(() => import("./Components/Reports/Reports"))
  ),
  WorkListGeneration: React.lazy(() =>
    retry(() =>
      import("./Components/InsuranceClaims/WorkListGeneration/WorkListGeneration")
    )
  ),
  RCMWorkbench: React.lazy(() =>
    retry(() =>
      import("./Components/InsuranceClaims/RCMWorkbench/RCMWorkbench")
    )
  ),
  StaffCashCollection: React.lazy(() =>
    retry(() => import("./Components/StaffCashCollection/StaffCashCollection"))
  ),
  InvoiceGeneration: React.lazy(() =>
    retry(() =>
      import("./Components/InsuranceClaims/InvoiceGeneration/InvoiceGeneration")
    )
  ),
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
      import("./Components/AssetManagement/DepreciationReversal/DepreciationReversal")
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
  VisitClose: React.lazy(() =>
    retry(() => import("./Components/VisitClose/VisitClose"))
  ),
  AlgaehModules: React.lazy(() =>
    retry(() => import("./Components/Algaeh/Algaeh"))
  ),
  SelfService: React.lazy(() =>
    retry(() =>
      import("./Components/EmployeeManagement/SelfService/SelfService")
    )
  ),
  AttendanceRegularization: React.lazy(() =>
    retry(() =>
      import("./Components/EmployeeManagement/AttendanceRegularization/AttendanceRegularization")
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
      import("./Components/PayrollManagement/PerformanceManagement/PerformanceManagement")
    )
  ),
  EmployeeDocuments: React.lazy(() =>
    retry(() =>
      import("./Components/EmployeeManagement/EmployeeDocuments/EmployeeDocuments")
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
      import("./Components/EmployeeManagement/EmployeeShiftRostering/EmployeeShiftRostering")
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

  PackageSetup: React.lazy(() =>
    retry(() => import("./Components/PackageSetup/PackageSetup"))
  )
};

const DirectRoutes = props => {
  const PlotPage = PageToPlot[props.componet];

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
};

export default DirectRoutes;
