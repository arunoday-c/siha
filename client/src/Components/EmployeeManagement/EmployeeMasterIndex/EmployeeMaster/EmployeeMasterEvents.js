import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import EmpMasterIOputs from "../../../../Models/EmployeeMaster";

const Validations = $this => {
  let isError = false;

  if ($this.state.employee_code.length <= 0) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Invalid Input. Employee Code Cannot be blank."
    });

    return isError;
  } else if ($this.state.title_id === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Invalid Input. Please Select Title."
    });

    return isError;
  } else if ($this.state.full_name.length <= 0) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Invalid Input. Name Cannot be blank."
    });

    return isError;
  } else if ($this.state.arabic_name.length <= 0) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Invalid Input. Arabic Name Cannot be blank."
    });

    return isError;
  } else if ($this.state.employee_designation_id === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Invalid Input. Please Select Designation."
    });

    return isError;
  } else if (
    $this.state.license_number.length <= 0 &&
    $this.state.isdoctor === "Y"
  ) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "IInvalid Input. License Number Cannot be blank."
    });

    return isError;
  } else if ($this.state.sex === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Invalid Input. Please Select Gender."
    });

    return isError;
  } else if ($this.state.date_of_birth === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Invalid Input. Date Of Birth Cannot be blank."
    });

    return isError;
  } else if ($this.state.country_id === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Invalid Input. Please Select Country."
    });

    return isError;
  } else if ($this.state.email.length <= 0) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Invalid Input. Email Cannot be blank."
    });

    return isError;
  } else if ($this.state.primary_contact_no === 0) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Invalid Input. Mobile No. Cannot be blank."
    });

    return isError;
  } else if ($this.state.deptDetails.length <= 0) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Add atleast one department to the list"
    });
    return isError;
  }
};

const InsertUpdateEmployee = $this => {
  const err = Validations($this);

  if (!err) {
    if ($this.state.hims_d_employee_id === null) {
      algaehApiCall({
        uri: "/employee/addEmployee",
        data: $this.state,
        onSuccess: response => {
          if (response.data.success === true) {
            swalMessage({
              title: "Saved successfully . .",
              type: "success"
            });
          }
        }
      });
    } else {
      $this.state.record_status = "A";
      algaehApiCall({
        uri: "/employee/updateEmployee",
        data: $this.state,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success === true) {
            swalMessage({
              title: "Updated successfully . .",
              type: "success"
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
