import React from "react";
import { FProvider } from "./EmployeeMasterContext";
import EmployeeMasterIndex from "./EmployeeMasterIndexBeta";

export default function EmployeeMaster() {
  return (
    <FProvider>
      <EmployeeMasterIndex />
    </FProvider>
  );
}
