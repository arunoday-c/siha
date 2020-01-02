import React from "react";
import {} from "../../";
export default function(props) {
  const Activated_Modueles =
    sessionStorage.getItem("ModuleDetails") !== null
      ? JSON.parse(AlgaehOpenContainer(sessionStorage.getItem("ModuleDetails")))
      : [];
}
