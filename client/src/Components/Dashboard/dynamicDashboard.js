import React from "react";
import { getCookie } from "../../utils/algaehApiCall";
import { AlgaehOpenContainer } from "../../utils/GlobalFunctions";
export default function DynamicDashboard(props) {
  const keydata = JSON.parse(
    AlgaehOpenContainer(sessionStorage.getItem("keyData"))
  );

  //http://localhost:8888/#/dashboard/101/2/3
  // path: "/dashboard/:branch_id/:role_id/:group_id",
  const dashshed = `http://localhost:8888/#/dashboard/${keydata.hospital_id}/${keydata.roles_id}/${keydata.group_id}`;
  return (
    <iframe
      src={dashshed}
      width="100%"
      style={{ border: "none" }}
      height="100%"
    ></iframe>
  );
}
