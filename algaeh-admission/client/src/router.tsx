import React, { useEffect, useState } from "react";
import App from "./App";
import AdmissionSetup from "./Components/AdmissionSetup";
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
];
interface interRouter {
  path: string;
  history: any;
  mainContext: any;
  globalVariables: any;
  algaehApiCall: Function;
}
export default function Router({
  path,
  history,
  mainContext,
  globalVariables,
  algaehApiCall,
}: interRouter) {
  const [Component, setComponent] = useState<React.ReactElement>(<></>);
  useEffect(() => {
    const filter = Routing.find((f) => f.path === path);
    if (filter) {
      setComponent(
        filter.component({
          history,
          mainContext,
          globalVariables,
          algaehApiCall,
        })
      );
    } else {
      setComponent(<h4>Path is not defined</h4>);
    }
    //eslint-disable-next-line
  }, [path]);
  return Component;
}
//--after-rebuild-hook='echo refreshing page. && ./reload.sh http://localhost:1313/daycare'
