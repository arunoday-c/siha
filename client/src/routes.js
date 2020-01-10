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
const PatientRegistration = React.lazy(() =>
  retry(() => import("./Components/RegistrationPatient/RegistrationPatient"))
);
const Layout = React.lazy(() =>
  retry(() => import("./Components/common/layout"))
);
const HrDashboard = React.lazy(() =>
  retry(() => import("./Components/Dashboard/hr-dashboard"))
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
  retry(() => import("./Components/NurseWorkbench/NurseWorkbench"))
);
const CommonDashboard = React.lazy(() =>
  retry(() => import("./Components/Dashboard/Dashboard"))
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
const DynamicDashboard = React.lazy(() =>
  retry(() => import("./Components/Dashboard/dynamicDashboard"))
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
const Appointment = React.lazy(() =>
  retry(() => import("./Components/FrontDesk/FrontDesk"))
);
const InitialStock = React.lazy(() =>
  retry(() => import("./Components/Pharmacy/InitialStock/InitialStock"))
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
const OPBillPendingList = React.lazy(() =>
  retry(() => import("./Components/OPBillPendingList/OPBillPendingList"))
);
const SalesReturn = React.lazy(() =>
  retry(() => import("./Components/Pharmacy/SalesReturn/SalesReturn"))
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
    path: "/Dashboard",
    isExactPath: true,
    component: (
      <LoadComponent>
        <HrDashboard />
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
    path: "/CommonDashboard",
    isExactPath: true,
    component: (
      <LoadComponent>
        <CommonDashboard />
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
