import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import Router from "./router";
const APP_ID = "Admission";
console.log("`mount_${APP_ID}`", `mount_${APP_ID}`);
// @ts-ignore
window[`mount_${APP_ID}`] = ({
  history,
  elementId,
  path,
  mainContext,
}: any) => {
  ReactDOM.render(
    <Router
      history={history || createBrowserHistory()}
      path={path}
      mainContext={mainContext}
    />,
    document.getElementById(elementId)
  );

  // unregister();
};
// @ts-ignore
window[`unmount_${APP_ID}`] = ({ elementId }) => {
  // @ts-ignore
  ReactDOM.unmountComponentAtNode(document.getElementById(elementId));
};
