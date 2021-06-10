import React from "react";
import ReactDOM from "react-dom";
import Router from "./router";
const APP_ID = "Admission";

// @ts-ignore
window[`mount_${APP_ID}`] = ({
  elementId,
  path,
  // mainContext,
  getGlobalVariables,
  getMainContext,
}: any) => {
  ReactDOM.render(
    <Router
      path={path}
      // mainContext={mainContext}
      getGlobalVariables={getGlobalVariables}
      getMainContext={getMainContext}
    />,
    document.getElementById(elementId)
  );
};
// @ts-ignore
window[`unmount_${APP_ID}`] = ({ elementId }) => {
  // @ts-ignore
  ReactDOM.unmountComponentAtNode(document.getElementById(elementId));
};
