// import { algaehApiCall } from "../../../utils/algaehApiCall";
// import swal from "sweetalert";

const Validations = $this => {
  let isError = false;

  if ($this.state.employee_code.length <= 0) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Employee Code Cannot be blank."
    });
    return isError;
  } else if ($this.state.title_id === null) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Please Select Title."
    });
    return isError;
  } else if ($this.state.full_name.length <= 0) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Name Cannot be blank."
    });
    return isError;
  } else if ($this.state.arabic_name.length <= 0) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Arabic Name Cannot be blank."
    });
    return isError;
  } else if ($this.state.employee_designation_id === null) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Please Select Designation."
    });
    return isError;
  } else if ($this.state.license_number.length <= 0) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. License Number Cannot be blank."
    });
    return isError;
  } else if ($this.state.sex === null) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Please Select Gender."
    });
    return isError;
  } else if ($this.state.date_of_birth === null) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Date Of Birth Cannot be blank."
    });
    return isError;
  } else if ($this.state.category_id === null) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Please Select Category."
    });
    return isError;
  } else if ($this.state.speciality_id === null) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Please Select Speciality."
    });
    return isError;
  } else if ($this.state.country_id === null) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Please Select Country."
    });
    return isError;
  } else if ($this.state.email.length <= 0) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Email Cannot be blank."
    });
    return isError;
  } else if ($this.state.primary_contact_no === 0) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Mobile No. Cannot be blank."
    });
    return isError;
  } else if ($this.state.deptDetails.length <= 0) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Atleast one department to attach.",
      pageDisplay: "DeptUserDetails"
    });
    return isError;
  }
};

const InsertUpdateEmployee = $this => {
  const err = Validations($this);
  debugger;
  if (!err) {
    debugger;
    // if ($this.state.hims_d_employee_id === null) {
    //   algaehApiCall({
    //     uri: "/pharmacy/addItemMaster",
    //     data: $this.state,
    //     onSuccess: response => {
    //       if (response.data.success === true) {
    //         swal("Saved successfully . .", {
    //           icon: "success",
    //           buttons: false,
    //           timer: 2000
    //         });
    //       }
    //     },
    //     onFailure: error => {
    //       console.log(error);
    //     }
    //   });
    // } else {
    //   $this.state.record_status = "A";
    //   algaehApiCall({
    //     uri: "/pharmacy/updateItemMasterAndUom",
    //     data: $this.state,
    //     method: "PUT",
    //     onSuccess: response => {
    //       if (response.data.success === true) {
    //         swal("Updated successfully . .", {
    //           icon: "success",
    //           buttons: false,
    //           timer: 2000
    //         });
    //       }
    //     },
    //     onFailure: error => {
    //       console.log(error);
    //     }
    //   });
    // }
  }
};

export { InsertUpdateEmployee };
