import React, { useEffect, useState } from "react";
import App from "./App";
import AdmissionSetup from "./Components/AdmissionSetup";
import BedManagement from "./Components/BedManagement";
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
];
interface interRouter {
  path: string;
  mainContext: any;
  globalVariables: any;
  // algaehApiCall: Function;
}
export default function Router({
  path,
  mainContext,
  globalVariables,
}: interRouter) {
  const [Component, setComponent] = useState<React.ReactElement>(<></>);
  useEffect(() => {
    const filter = Routing.find((f) => f.path === path);
    if (filter) {
      setComponent(
        filter.component({
          mainContext,
          globalVariables,
        })
      );
    } else {
      setComponent(<h4>Path is not defined</h4>);
    }
    //eslint-disable-next-line
  }, [path]);
  return Component;
}
