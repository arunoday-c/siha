import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import EmpMasterIOputs from "../../../../Models/EmployeeMaster";
import Enumerable from "linq";
import moment from "moment";

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
  } else if ($this.state.personalDetails.deptDetails !== 0) {
    const activeDept = Enumerable.from($this.state.personalDetails.deptDetails)
      .where(w => w.dep_status === "A")
      .toArray();

    if (activeDept.length > 1) {
      isError = true;
      swalMessage({
        type: "warning",
        title: "Only one Department can be Active."
      });
    }
    return isError;
  }

  return false;
};

const InsertUpdateEmployee = $this => {
  const err = Validations($this);
  console.log("Input:", $this.state);
  debugger;
  if (!err) {
    if ($this.state.personalDetails.insertdeptDetails.length > 0) {
      for (
        var i = 0;
        i < $this.state.personalDetails.insertdeptDetails.length;
        i++
      ) {
        $this.state.personalDetails.insertdeptDetails[i].from_date === null
          ? null
          : moment(
              $this.state.personalDetails.insertdeptDetails[i].from_date
            ).format("YYYY-MM-DD");

        $this.state.personalDetails.insertdeptDetails[i].to_date === null
          ? null
          : moment(
              $this.state.personalDetails.insertdeptDetails[i].to_date
            ).format("YYYY-MM-DD");
      }
    }

    if ($this.state.personalDetails.updatedeptDetails.length > 0) {
      for (
        var i = 0;
        i < $this.state.personalDetails.updatedeptDetails.length;
        i++
      ) {
        $this.state.personalDetails.updatedeptDetails[i].from_date === null
          ? null
          : moment(
              $this.state.personalDetails.updatedeptDetails[i].from_date
            ).format("YYYY-MM-DD");

        $this.state.personalDetails.updatedeptDetails[i].to_date === null
          ? null
          : moment(
              $this.state.personalDetails.updatedeptDetails[i].to_date
            ).format("YYYY-MM-DD");
      }
    }

    debugger;
    const activeDept = Enumerable.from($this.state.personalDetails.deptDetails)
      .where(w => w.dep_status === "A")
      .toArray();

    if (activeDept.length !== 0) {
      $this.state.personalDetails.reporting_to_id =
        activeDept[0].reporting_to_id;
      $this.state.personalDetails.sub_department_id =
        activeDept[0].sub_department_id;
      $this.state.personalDetails.employee_designation_id =
        activeDept[0].employee_designation_id;
    }

    if ($this.state.personalDetails.hims_d_employee_id === null) {
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
      // $this.state.personalDetails

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
