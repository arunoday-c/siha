import { swalMessage } from "../../utils/algaehApiCall";

export function Validations(state) {
  let isError = false;

  var tow_word_name = state.state.full_name.split(" ");

  if (state.state.full_name.length <= 0) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Name Cannot be blank."
    });

    document.querySelector("[name='full_name']").focus();
    return isError;
  } else if (tow_word_name.length < 2) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Name Atleast 2 word required."
    });

    document.querySelector("[name='full_name']").focus();
    return isError;
  } else if (state.state.requied_emp_id === "Y" && state.state.employee_id <= 0) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Employee ID Cannot be blank."
    });

    document.querySelector("[name='employee_id']").focus();
    return isError;
  } else if (state.state.arabic_name.length <= 0) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Arabic Name Cannot be blank."
    });

    document.querySelector("[name='arabic_name']").focus();
    return isError;
  } else if (state.state.title_id <= 0) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Title Cannot be blank."
    });

    return isError;
  } else if (state.state.gender === null) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Select the gender."
    });

    return isError;
  } else if (state.state.primary_identity_id <= 0) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Select Primary ID."
    });

    return isError;
  } else if (state.state.primary_id_no.length <= 0) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Primary ID No. Cannot be blank."
    });

    document.querySelector("[name='primary_id_no']").focus();
    return isError;
  } else if (state.state.nationality_id <= 0) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Nationality Cannot be blank."
    });
    return isError;
  } else if (state.state.country_id <= 0) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Country Cannot be blank."
    });

    return isError;
  } else if (state.state.contact_number <= 0) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Mobile No. Cannot be blank."
    });

    document.querySelector("[name='contact_number']").focus();
    return isError;
  } else if (
    state.state.patient_type === null ||
    state.state.patient_type === ""
  ) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Please select the Patient Type."
    });
    return isError;
  }
}
