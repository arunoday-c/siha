import React from "react";
import EmployeeMasterPopup from "./employeeMasterPopup";

export default function EmployeeModal({
  open,
  onClose,
  editEmployee,
  employeeDetailsPop,
  employee_status,
  HeaderCaption,
}) {
  debugger;
  return (
    <EmployeeMasterPopup
      visible={open}
      onClose={onClose}
      employeeDetails={employeeDetailsPop}
      employee_status={employee_status}
      HeaderCaption={HeaderCaption}
    />
  );
}
