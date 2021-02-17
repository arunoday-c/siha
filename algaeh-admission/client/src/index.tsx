import React from "react";
import ReactDOM from "react-dom";
import Router from "./router";
const APP_ID = "Admission";

// @ts-ignore
window[`mount_${APP_ID}`] = ({
  elementId,
  path,
  mainContext,
  globalVariables,
}: any) => {
  ReactDOM.render(
    <Router
      path={path}
      mainContext={mainContext}
      globalVariables={globalVariables}
    />,
    document.getElementById(elementId)
  );
};
// @ts-ignore
window[`unmount_${APP_ID}`] = ({ elementId }) => {
  // @ts-ignore
  ReactDOM.unmountComponentAtNode(document.getElementById(elementId));
};
