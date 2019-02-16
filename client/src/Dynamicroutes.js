import React from "react";

const PageToPlot = {
  Dashboard: React.lazy(() => import("./Components/Dashboard/Dashboard")),
  FrontDesk: React.lazy(() =>
    import("./Components/RegistrationPatient/RegistrationPatient")
  ),
  BusinessSetup: React.lazy(() =>
    import("./Components/BusinessSetup/BusinessSetup")
  ),
  CommonSetup: React.lazy(() => import("./Components/CommonSetup/CommonSetup")),
  OPBilling: React.lazy(() => import("./Components/OPBilling/OPBilling")),
  BillDetails: React.lazy(() => import("./Components/BillDetails/BillDetails")),
  InsuranceSetup: React.lazy(() =>
    import("./Components/InsuranceSetup/InsuranceSetup")
  ),
  SampleCollection: React.lazy(() =>
    import("./Components/Laboratory/SampleCollection/SampleCollection")
  ),
  DoctorsWorkbench: React.lazy(() =>
    import("./Components/Workbench/Workbench")
  ),
  NurseWorkbench: React.lazy(() => import("./Components/Workbench/Workbench")),
  MedicalWorkbenchSetup: React.lazy(() =>
    import("./Components/MedicalWorkbenchSetup/MedicalWorkbenchSetup")
  ),
  AccessionAcknowledgement: React.lazy(() =>
    import("./Components/Laboratory/AccessionAcknowledgement/AccessionAcknowledgement")
  ),
  PreApproval: React.lazy(() => import("./Components/PreApproval/PreApproval")),
  LabSetup: React.lazy(() => import("./Components/LabSetup/LabSetup")),
  InvestigationSetup: React.lazy(() =>
    import("./Components/InvestigationSetup/InvestigationSetup")
  ),
  RadOrderedList: React.lazy(() =>
    import("./Components/Radiology/RadOrderedList/RadOrderedList")
  ),
  RadScheduledList: React.lazy(() =>
    import("./Components/Radiology/RadScheduledList/RadScheduledList")
  ),
  ResultEntryList: React.lazy(() =>
    import("./Components/Laboratory/ResultEntryList/ResultEntryList")
  ),
  InitialStock: React.lazy(() =>
    import("./Components/Pharmacy/InitialStock/InitialStock")
  ),
  PrescriptionList: React.lazy(() =>
    import("./Components/Pharmacy/PrescriptionList/PrescriptionList")
  ),
  Appointment: React.lazy(() => import("./Components/FrontDesk/FrontDesk")),
  AppointmentAr: React.lazy(() =>
    import("./Components/AppointmentAr/AppointmentAr")
  ),
  PharmacySetup: React.lazy(() =>
    import("./Components/PharmacySetup/PharmacySetup")
  ),
  StockEnquiry: React.lazy(() =>
    import("./Components/Pharmacy/StockEnquiry/StockEnquiry")
  ),
  ItemMomentEnquiry: React.lazy(() =>
    import("./Components/Pharmacy/ItemMomentEnquiry/ItemMomentEnquiry")
  ),
  AppointmentSetup: React.lazy(() =>
    import("./Components/AppointmentSetup/AppointmentSetup")
  ),
  ItemSetup: React.lazy(() => import("./Components/ItemSetup/ItemSetup")),
  EmployeeMasterIndex: React.lazy(() =>
    import("./Components/EmployeeManagement/EmployeeMasterIndex/EmployeeMasterIndex")
  ),
  PhysicianScheduleSetup: React.lazy(() =>
    import("./Components/PhysicianScheduleSetup/PhySchSetup")
  ),
  FrontDeskAr: React.lazy(() =>
    import("./Components/RegistrationPatientAr/RegistrationPatientAr")
  ),
  OPBillingAr: React.lazy(() => import("./Components/OPBillingAr/OPBillingAr")),
  DoctorCommission: React.lazy(() =>
    import("./Components/DoctorCommission/DoctorCommission")
  ),
  HospitalServiceSetup: React.lazy(() =>
    import("./Components/HospitalServiceSetup/HospitalServiceSetup")
  ),
  PointOfSale: React.lazy(() =>
    import("./Components/Pharmacy/PointOfSale/PointOfSale")
  ),
  OPBillPendingList: React.lazy(() =>
    import("./Components/OPBillPendingList/OPBillPendingList")
  ),
  MRDList: React.lazy(() => import("./Components/MRD/MRD")),
  SalesReturn: React.lazy(() =>
    import("./Components/Pharmacy/SalesReturn/SalesReturn")
  ),
  RequisitionEntry: React.lazy(() =>
    import("./Components/Pharmacy/RequisitionEntry/RequisitionEntry")
  ),
  ProcedureSetup: React.lazy(() =>
    import("./Components/ProcedureSetup/ProcedureSetup")
  ),
  TransferEntry: React.lazy(() =>
    import("./Components/Pharmacy/TransferEntry/TransferEntry")
  ),
  RequisitionList: React.lazy(() =>
    import("./Components/Pharmacy/RequisitionList/RequisitionSwitch")
  ),
  ReportsList: React.lazy(() => import("./Components/Reports/Reports")),
  WorkListGeneration: React.lazy(() =>
    import("./Components/InsuranceClaims/WorkListGeneration/WorkListGeneration")
  ),
  RCMWorkbench: React.lazy(() =>
    import("./Components/InsuranceClaims/RCMWorkbench/RCMWorkbench")
  ),
  StaffCashCollection: React.lazy(() =>
    import("./Components/StaffCashCollection/StaffCashCollection")
  ),
  InvoiceGeneration: React.lazy(() =>
    import("./Components/InsuranceClaims/InvoiceGeneration/InvoiceGeneration")
  ),
  InventorySetup: React.lazy(() =>
    import("./Components/InventorySetup/InventorySetup")
  ),
  InventoryItemMaster: React.lazy(() =>
    import("./Components/InventoryItemMaster/InventoryItemMaster")
  ),
  InvInitialStock: React.lazy(() =>
    import("./Components/Inventory/InvInitialStock/InvInitialStock")
  ),
  InvStockEnquiry: React.lazy(() =>
    import("./Components/Inventory/InvStockEnquiry/InvStockEnquiry")
  ),
  InvItemMomentEnquiry: React.lazy(() =>
    import("./Components/Inventory/InvItemMomentEnquiry/InvItemMomentEnquiry")
  ),
  InvRequisitionEntry: React.lazy(() =>
    import("./Components/Inventory/InvRequisitionEntry/InvRequisitionEntry")
  ),
  InvRequisitionList: React.lazy(() =>
    import("./Components/Inventory/InvRequisitionList/InvRequisitionSwitch")
  ),
  InvTransferEntry: React.lazy(() =>
    import("./Components/Inventory/InvTransferEntry/InvTransferEntry")
  ),
  VendorSetup: React.lazy(() => import("./Components/VendorSetup/VendorSetup")),
  DayEndProcess: React.lazy(() =>
    import("./Components/Finance/DayEndProcess/DayEndProcess")
  ),
  FinanceMapping: React.lazy(() =>
    import("./Components/Finance/FinanceMapping/FinanceMapping")
  ),
  DeliveryNoteEntry: React.lazy(() =>
    import("./Components/Procurement/DeliveryNoteEntry/DeliveryNoteEntry")
  ),
  PurchaseOrderEntry: React.lazy(() =>
    import("./Components/Procurement/PurchaseOrderEntry/PurchaseOrderEntry")
  ),
  ReceiptEntry: React.lazy(() =>
    import("./Components/Procurement/ReceiptEntry/ReceiptEntry")
  ),
  ShipmentEntry: React.lazy(() =>
    import("./Components/Procurement/ShipmentEntry/ShipmentEntry")
  ),
  AcquisitionEntry: React.lazy(() =>
    import("./Components/AssetManagement/AcquisitionEntry/AcquisitionEntry")
  ),
  DepreciationEntry: React.lazy(() =>
    import("./Components/AssetManagement/DepreciationEntry/DepreciationEntry")
  ),
  DepreciationReversal: React.lazy(() =>
    import("./Components/AssetManagement/DepreciationReversal/DepreciationReversal")
  ),
  Disposal: React.lazy(() =>
    import("./Components/AssetManagement/Disposal/Disposal")
  ),
  PurchaseOrderList: React.lazy(() =>
    import("./Components/Procurement/PurchaseOrderList/PurchaseSwitch")
  ),
  PatientRecall: React.lazy(() =>
    import("./Components/PatientRecall/PatientRecall")
  ),
  AdministrationSetup: React.lazy(() =>
    import("./Components/AdministrationSetup/AdminSetup")
  ),
  OPBillCancellation: React.lazy(() =>
    import("./Components/OPBillCancellation/OPBillCancellation")
  ),
  OPCreditSettlement: React.lazy(() =>
    import("./Components/OPCreditSettlement/OPCreditSettlement")
  ),
  POSCreditSettlement: React.lazy(() =>
    import("./Components/Pharmacy/POSCreditSettlement/POSCreditSettlement")
  ),
  VisitClose: React.lazy(() => import("./Components/VisitClose/VisitClose")),
  AlgaehModules: React.lazy(() => import("./Components/Algaeh/Algaeh")),
  SelfService: React.lazy(() =>
    import("./Components/EmployeeManagement/SelfService/SelfService")
  ),
  AttendanceRegularization: React.lazy(() =>
    import("./Components/EmployeeManagement/AttendanceRegularization/AttendanceRegularization")
  ),
  PayrollSettings: React.lazy(() =>
    import("./Components/PayrollManagement/PayrollSettings/PayrollSettings")
  ),
  SalaryManagement: React.lazy(() =>
    import("./Components/PayrollManagement/SalaryManagement/SalaryManagement")
  ),
  HolidayMgmnt: React.lazy(() =>
    import("./Components/PayrollManagement/HolidayManagement/HolidayMgmnt")
  ),
  HRSettings: React.lazy(() =>
    import("./Components/EmployeeManagement/HRSettings/HRSettings")
  ),
  LeaveManagement: React.lazy(() =>
    import("./Components/PayrollManagement/LeaveManagement/LeaveManagement")
  ),
  AttendanceManagement: React.lazy(() =>
    import("./Components/PayrollManagement/AttendanceMgmt/AttendanceMgmt")
  ),
  ExitManagement: React.lazy(() =>
    import("./Components/PayrollManagement/ExitManagement/ExitManagement")
  ),
  LoanManagement: React.lazy(() =>
    import("./Components/PayrollManagement/LoanManagement/LoanManagement")
  ),
  PayrollWorkBench: React.lazy(() =>
    import("./Components/PayrollManagement/PayrollWorkbench/PayrollWorkbench")
  ),
  PerformanceManagement: React.lazy(() =>
    import("./Components/PayrollManagement/PerformanceManagement/PerformanceManagement")
  ),
  EmployeeDocuments: React.lazy(() =>
    import("./Components/EmployeeManagement/EmployeeDocuments/EmployeeDocuments")
  ),
  PayrollOptions: React.lazy(() =>
    import("./Components/PayrollManagement/PayrollOptions/PayrollOptions")
  ),
  ClinicalDeskNew: React.lazy(() =>
    import("./Components/DoctorsWorkbench/DoctorsWorkbench-new")
  ),
  EmpShiftRost: React.lazy(() =>
    import("./Components/EmployeeManagement/EmployeeShiftRostering/EmployeeShiftRostering")
  ),
  Wps: React.lazy(() => import("./Components/PayrollManagement/WPS/WPS")),

  ProjJobCst: React.lazy(() =>
    import("./Components/EmployeeManagement/ProjectJobCost/ProjectJobCost")
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
