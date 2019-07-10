import { swalMessage } from "../../utils/algaehApiCall";
import { AlgaehOpenContainer } from "../../utils/GlobalFunctions";

export function Validations(state) {
  let isError = false;

  var tow_word_name = state.state.full_name.split(" ");

  let requied_emp_id = JSON.parse(
    AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
  ).requied_emp_id;

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
  } else if (requied_emp_id === "Y" && state.state.employee_id <= 0) {
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
    state.state.insured === "Y" &&
    (state.state.primary_insurance_provider_id === null ||
      state.state.primary_network_office_id === null ||
      state.state.primary_network_id === null ||
      state.state.primary_card_number === null ||
      state.state.primary_card_number === "" ||
      state.state.primary_effective_start_date === null ||
      state.state.primary_effective_end_date === null)
  ) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Please select the primary insurance details properly."
    });

    return isError;
  } else if (
    state.state.sec_insured === "Y" &&
    (state.state.secondary_insurance_provider_id === null ||
      state.state.secondary_network_office_id === null ||
      state.state.secondary_network_id === null)
  ) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Please select the secondary insurance details properly."
    });

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
  } else if (state.state.unbalanced_amount > 0) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Total receipt amount should be equal to reciveable amount."
    });

    return isError;
  } else if (state.state.shift_id === null) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Shift is Mandatory."
    });

    return isError;
  } else if (state.state.counter_id === null) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Counter is Mandatory."
    });

    return isError;
  } else if (
    state.state.existing_plan === "Y" &&
    state.state.treatment_plan_id === null
  ) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Treatment Plan is Mandatory."
    });

    return isError;
  }
  if (state.state.card_amount > 0) {
    if (state.state.card_number === null || state.state.card_number === "") {
      isError = true;

      swalMessage({
        type: "warning",
        title: "Invalid. Card Number cannot be blank."
      });

      document.querySelector("[name='card_number']").focus();
      return isError;
    }

    // if (state.state.card_date === null || state.state.card_date === "") {
    //   isError = true;

    //   swalMessage({
    //     type: "warning",
    //     title: "Invalid. Card Date Cannot be blank."
    //   });

    //   document.querySelector("[name='card_date']").focus();
    //   return isError;
    // }
  }
  if (state.state.cheque_amount > 0) {
    if (
      state.state.cheque_number === null ||
      state.state.cheque_number === ""
    ) {
      isError = true;

      swalMessage({
        type: "warning",
        title: "Check Number cannot be blank."
      });

      document.querySelector("[name='cheque_number']").focus();
      return isError;
    }

    // if (state.state.cheque_date === null || state.state.cheque_date === "") {
    //   isError = true;
    //
    //   swalMessage({
    //     type: "warning",
    //     title: "Cheque Date Cannot be blank."
    //   });
    //
    //   document.querySelector("[name='cheque_date']").focus();
    //   return isError;
    // }
  }
}
