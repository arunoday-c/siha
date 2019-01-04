import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import EmpMasterIOputs from "../../../../Models/EmployeeMaster";

const Validations = $this => {
  let isError = false;
  debugger;
  if ($this.state.personalDetails.employee_code.length <= 0) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Employee Code. Cannot be blank."
    });

    return isError;
  } else if ($this.state.personalDetails.full_name.length <= 0) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Name. Cannot be blank."
    });

    return isError;
  } else if ($this.state.personalDetails.arabic_name.length <= 0) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Arabic Name. Cannot be blank."
    });

    return isError;
  } else if (
    $this.state.personalDetails.license_number === null &&
    $this.state.personalDetails.isdoctor === "Y"
  ) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "License Number. Cannot be blank."
    });

    return isError;
  } else if ($this.state.personalDetails.sex === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Gender. cannot be blank"
    });

    return isError;
  } else if ($this.state.personalDetails.date_of_birth === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Date Of Birth. Cannot be blank."
    });

    return isError;
  } else if ($this.state.personalDetails.primary_contact_no === 0) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Mobile No. Cannot be blank."
    });

    return isError;
  } else if ($this.state.personalDetails.date_of_joining === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Date of Joining. Cannot be blank."
    });

    return isError;
  } else if ($this.state.personalDetails.appointment_type === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Appointment Type. Cannot be blank."
    });

    return isError;
  } else if ($this.state.personalDetails.employee_type === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Employee Type. Cannot be blank."
    });

    return isError;
  } else if ($this.state.personalDetails.employee_status === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Employee Status. Cannot be blank."
    });

    return isError;
  } else if ($this.state.personalDetails.employee_bank_name === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Bank Name. Cannot be blank."
    });

    return isError;
  } else if ($this.state.personalDetails.employee_bank_ifsc_code === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "SWIFT Code. Cannot be blank."
    });

    return isError;
  } else if ($this.state.personalDetails.employee_account_number === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Account Number. Cannot be blank."
    });

    return isError;
  } else if ($this.state.personalDetails.company_bank_id === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Select A Bank. Cannot be blank."
    });

    return isError;
  } else if ($this.state.personalDetails.mode_of_payment === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Mode of Payment. Cannot be blank."
    });

    return isError;
  }

  return false;
};

const InsertUpdateEmployee = $this => {
  const err = Validations($this);
  console.log("Input:", $this.state);
  debugger;
  if (!err) {
    if ($this.state.personalDetails.company_bank_id === null) {
      const hospital = JSON.parse(sessionStorage.getItem("CurrencyDetail"));
      const _payload = {
        hospital_id: hospital.hims_d_hospital_id,
        ...$this.state.personalDetails
      };
      console.log("_payload", _payload);

      algaehApiCall({
        uri: "/employee/addEmployeeMaster",
        data: _payload,
        onSuccess: response => {
          if (response.data.success === true) {
            $this.setState({
              hims_d_employee_id: response.data.records.insertId
            });

            swalMessage({
              type: "success",
              title: "Saved Successfully..."
            });
          }
        }
      });
    } else {
      const hospital = JSON.parse(sessionStorage.getItem("CurrencyDetail"));
      const _payload = {
        hospital_id: hospital.hims_d_hospital_id,
        ...$this.state.personalDetails
      };
      console.log("_payload", _payload);

      algaehApiCall({
        uri: "/employee/updateEmployee",
        data: _payload,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success === true) {
            swalMessage({
              type: "success",
              title: "Updated Successfully..."
            });
          }
        }
      });
    }
  }
};

const ClearEmployee = $this => {
  let IOputs = EmpMasterIOputs.inputParam();
  IOputs.pageDisplay = "PersonalDetails";
  $this.setState(IOputs);
};

export { InsertUpdateEmployee, ClearEmployee };
