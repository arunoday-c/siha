import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import EmpMasterIOputs from "../../../../Models/EmployeeMaster";

const Validations = $this => {
  let isError = false;

  // if ($this.state.employee_code.length <= 0) {
  //   isError = true;
  //   swalMessage({
  //     type: "warning",
  //     title: "Invalid Input. Employee Code Cannot be blank."
  //   });

  //   return isError;
  //   // } else if ($this.state.title_id === null) {
  //   //   isError = true;
  //   //   swalMessage({
  //   //     type: "warning",
  //   //     title: "Invalid Input. Please Select Title."
  //   //   });

  //   //   return isError;
  // } else if ($this.state.full_name.length <= 0) {
  //   isError = true;
  //   swalMessage({
  //     type: "warning",
  //     title: "Invalid Input. Name Cannot be blank."
  //   });

  //   return isError;
  // } else if ($this.state.arabic_name.length <= 0) {
  //   isError = true;

  //   swalMessage({
  //     type: "warning",
  //     title: "Invalid Input. Arabic Name Cannot be blank."
  //   });

  //   return isError;
  // } else if ($this.state.employee_designation_id === null) {
  //   isError = true;
  //   swalMessage({
  //     type: "warning",
  //     title: "Invalid Input. Please Select Designation."
  //   });

  //   return isError;
  // } else if (
  //   $this.state.license_number.length <= 0 &&
  //   $this.state.isdoctor === "Y"
  // ) {
  //   isError = true;
  //   swalMessage({
  //     type: "warning",
  //     title: "IInvalid Input. License Number Cannot be blank."
  //   });

  //   return isError;
  // } else if ($this.state.sex === null) {
  //   isError = true;
  //   swalMessage({
  //     type: "warning",
  //     title: "Invalid Input. Please Select Gender."
  //   });

  //   return isError;
  // } else if ($this.state.date_of_birth === null) {
  //   isError = true;
  //   swalMessage({
  //     type: "warning",
  //     title: "Invalid Input. Date Of Birth Cannot be blank."
  //   });

  //   return isError;
  // } else if ($this.state.country_id === null) {
  //   isError = true;
  //   swalMessage({
  //     type: "warning",
  //     title: "Invalid Input. Please Select Country."
  //   });

  //   return isError;
  // } else if ($this.state.email.length <= 0) {
  //   isError = true;
  //   swalMessage({
  //     type: "warning",
  //     title: "Invalid Input. Email Cannot be blank."
  //   });

  //   return isError;
  // } else if ($this.state.primary_contact_no === 0) {
  //   isError = true;
  //   swalMessage({
  //     type: "warning",
  //     title: "Invalid Input. Mobile No. Cannot be blank."
  //   });

  //   return isError;
  // } else if ($this.state.deptDetails.length <= 0) {
  //   isError = true;
  //   swalMessage({
  //     type: "warning",
  //     title: "Add atleast one department to the list"
  //   });
  //   return isError;
  // }

  return false;
};

const InsertUpdateEmployee = $this => {
  const err = Validations($this);

  if (!err) {
    if ($this.state.hims_d_employee_id === null) {
      let data = {
        employee_code: $this.state.employee_code,
        full_name: $this.state.full_name,
        arabic_name: $this.state.arabic_name,
        date_of_birth: $this.state.date_of_birth,
        sex: $this.state.sex,
        primary_contact_no: $this.state.primary_contact_no,
        email: $this.state.email,
        blood_group: $this.state.blood_group,
        nationality: $this.state.nationality,
        religion_id: $this.state.religion_id,
        marital_status: $this.state.marital_status,
        present_address: $this.state.present_address,
        present_address2: $this.state.present_address2,
        present_pincode: $this.state.present_pincode,
        present_city_id: $this.state.present_city_id,
        present_state_id: $this.state.present_state_id,
        present_country_id: $this.state.present_country_id,
        permanent_address: $this.state.same_address
          ? $this.state.present_address
          : $this.state.permanent_address,
        permanent_address2: $this.state.same_address
          ? $this.state.present_address2
          : $this.state.permanent_address2,
        permanent_pincode: $this.state.same_address
          ? $this.state.present_pincode
          : $this.state.permanent_pincode,
        permanent_city_id: $this.state.same_address
          ? $this.state.present_city_id
          : $this.state.permanent_city_id,
        permanent_state_id: $this.state.same_address
          ? $this.state.present_state_id
          : $this.state.permanent_state_id,
        permanent_country_id: $this.state.same_address
          ? $this.state.present_country_id
          : $this.state.permanent_country_id,
        isdoctor: $this.state.isdoctor,
        license_number: $this.state.license_number,
        date_of_joining: $this.state.date_of_joining,
        appointment_type: $this.state.date_of_joining,
        employee_type: $this.state.employee_type,
        reliving_date: $this.state.reliving_date,
        notice_period: $this.state.notice_period,
        date_of_leaving: $this.state.date_of_joining,
        company_bank_id: $this.state.company_bank_id,
        employee_bank_name: $this.state.employee_bank_name,
        employee_bank_ifsc_code: $this.state.employee_bank_ifsc_code,
        employee_account_number: $this.state.employee_account_number,
        mode_of_payment: $this.state.mode_of_payment
      };

      algaehApiCall({
        uri: "/employee/addEmployeeMaster",
        data: data,
        onSuccess: response => {
          if (response.data.success === true) {
            $this.setState({
              employee_id: response.data.records.insertId
            });
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
  // if (!err) {
  //   if ($this.state.hims_d_employee_id === null) {
  //     algaehApiCall({
  //       uri: "/employee/addEmployee",
  //       data: $this.state,
  //       onSuccess: response => {
  //         if (response.data.success === true) {
  //           swalMessage({
  //             title: "Saved successfully . .",
  //             type: "success"
  //           });
  //         }
  //       }
  //     });
  //   } else {
  //     $this.state.record_status = "A";
  //     algaehApiCall({
  //       uri: "/employee/updateEmployee",
  //       data: $this.state,
  //       method: "PUT",
  //       onSuccess: response => {
  //         if (response.data.success === true) {
  //           swalMessage({
  //             title: "Updated successfully . .",
  //             type: "success"
  //           });
  //         }
  //       }
  //     });
  //   }
  // }
};

const ClearEmployee = $this => {
  let IOputs = EmpMasterIOputs.inputParam();
  IOputs.pageDisplay = "PersonalDetails";
  $this.setState(IOputs);
};

export { InsertUpdateEmployee, ClearEmployee };
