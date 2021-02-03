import React, { useEffect, useState } from "react";
import App from "./App";
const Routing = [
  {
    path: "/",
    component: (props: any) => <App {...props} />,
  },
  {
    path: "/testing",
    component: (props: any) => <h1>Here in Testing Page111</h1>,
  },
];
interface interRouter {
  path: string;
  history: any;
  mainContext: any;
}
export default function Router({ path, history, mainContext }: interRouter) {
  const [Component, setComponent] = useState<React.ReactElement>(<></>);
  useEffect(() => {
    const filter = Routing.find((f) => f.path === path);
    if (filter) {
      setComponent(filter.component({ history, mainContext }));
    } else {
      setComponent(<h4>Path is not defined</h4>);
    }
  }, [path]);
  return Component;
}
//--after-rebuild-hook='echo refreshing page. && ./reload.sh http://localhost:1313/daycare'
