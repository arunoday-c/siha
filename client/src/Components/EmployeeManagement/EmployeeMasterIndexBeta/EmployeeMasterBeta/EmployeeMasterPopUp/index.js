import React from "react";
// import { ContextProviderForEmployee } from "../../EmployeeMasterContextForEmployee";

import EmployeeMasterPopup from "./employeeMasterPopup";

export default function EmployeeModal({
  open,
  onClose,
  editEmployee,
  employeeDetailsPop,
  employee_status,
  HeaderCaption,
}) {
  return (
    // <ContextProviderForEmployee>
    <EmployeeMasterPopup
      visible={open}
      onClose={onClose}
      employeeDetails={employeeDetailsPop}
      employee_status={employee_status}
      HeaderCaption={HeaderCaption}
    />
    // </ContextProviderForEmployee>
  );
}
