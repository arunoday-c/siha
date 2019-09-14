import React from "react";
import { getCookie } from "../../utils/algaehApiCall";
export default function DynamicDashboard(props) {
  const _keyResources = getCookie("keyResources");
  debugger;
  return (
    <iframe src="http://localhost:8888/" width="100%" height="100%"></iframe>
  );
}
