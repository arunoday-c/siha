import React, { useEffect, useState } from "react";
import App from "./App";
import AdmissionSetup from "./Components/AdmissionSetup";
import BedManagement from "./Components/BedManagement";
import PatientAdmission from "./Components/PatientAdmission";
const Routing = [
  {
    path: "/",
    component: (props: any) => <App {...props} />,
  },
  {
    path: "/admissionSetup",
    // component: (props: any) => <h1>Here in Testing Page111</h1>,
    component: (props: any) => <AdmissionSetup {...props} />,
  },
  {
    path: "/bedManagement",
    // component: (props: any) => <h1>Here in Testing Page111</h1>,
    component: (props: any) => <BedManagement {...props} />,
  },
  {
    path: "/patientAdmission",
    // component: (props: any) => <h1>Here in Testing Page111</h1>,
    component: (props: any) => <PatientAdmission {...props} />,
  },
];
interface interRouter {
  path: string;
  // mainContext: any;
  getGlobalVariables: Function;
  getsportlightSearch: Function;
  // globalVariables: any;
  // algaehApiCall: Function;
  // appContext: any;
  getMainContext: Function;
}
export default function Router({
  path,
  // mainContext,
  getsportlightSearch,
  getGlobalVariables,
  getMainContext,
}: interRouter) {
  const [Component, setComponent] = useState<React.ReactElement>(<></>);
  useEffect(() => {
    const filter = Routing.find((f) => f.path === path);
    if (filter) {
      setComponent(
        filter.component({
          getGlobalVariables,
          getMainContext,
          getsportlightSearch,
          // mainContext,
          // globalVariables,
          // appContext,
        })
      );
    } else {
      setComponent(<h4>Path is not defined</h4>);
    }
    //eslint-disable-next-line
  }, [path]);
  return Component;
}
