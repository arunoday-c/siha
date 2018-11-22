import { swalMessage } from "../../utils/algaehApiCall";
export function Validations(state) {
  let isError = false;

  if (state.state.full_name.length <= 0) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Invalid Input. Name Cannot be blank."
    });

    document.querySelector("[name='full_name']").focus();
    return isError;
  } else if (state.state.arabic_name.length <= 0) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Invalid Input. Arabic Name Cannot be blank."
    });

    document.querySelector("[name='arabic_name']").focus();
    return isError;
  } else if (state.state.title_id <= 0) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Invalid Input. Title Cannot be blank."
    });

    return isError;
  } else if (state.state.gender === null) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Invalid Input. Select the gender."
    });

    return isError;
  } else if (state.state.primary_identity_id <= 0) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Invalid Input. Select Primary ID."
    });

    return isError;
  } else if (state.state.primary_id_no.length <= 0) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Invalid Input. Primary ID No. Cannot be blank."
    });

    document.querySelector("[name='primary_id_no']").focus();
    return isError;
  } else if (state.state.nationality_id <= 0) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Invalid Input. Nationality Cannot be blank."
    });
    return isError;
  } else if (state.state.country_id <= 0) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Invalid Input. Country Cannot be blank."
    });

    return isError;
  } else if (state.state.contact_number <= 0) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Invalid Input. Mobile No. Cannot be blank."
    });

    document.querySelector("[name='contact_number']").focus();
    return isError;
  } else if (state.state.card_amount > 0) {
    if (state.state.card_number === null || state.state.card_number === "") {
      isError = true;

      swalMessage({
        type: "warning",
        title: "Invalid. Card Number cannot be blank."
      });

      document.querySelector("[name='card_number']").focus();
      return isError;
    }

    if (state.state.card_date === null || state.state.card_date === "") {
      isError = true;

      swalMessage({
        type: "warning",
        title: "Invalid. Card Date Cannot be blank."
      });

      document.querySelector("[name='card_date']").focus();
      return isError;
    }
  } else if (state.state.cheque_amount > 0) {
    if (
      state.state.cheque_number === null ||
      state.state.cheque_number === ""
    ) {
      isError = true;

      swalMessage({
        type: "warning",
        title: "Invalid Input. Check Number cannot be blank."
      });

      document.querySelector("[name='cheque_number']").focus();
      return isError;
    }

    if (state.state.cheque_date === null || state.state.cheque_date === "") {
      isError = true;

      swalMessage({
        type: "warning",
        title: "Invalid Input. Cheque Date Cannot be blank."
      });

      document.querySelector("[name='cheque_date']").focus();
      return isError;
    }
  } else if (
    state.state.insured === "Y" &&
    (state.state.primary_insurance_provider_id === null ||
      state.state.primary_network_office_id === null ||
      state.state.primary_network_id === null ||
      state.state.primary_card_number === null ||
      state.state.primary_effective_start_date === null ||
      state.state.primary_effective_end_date === null)
  ) {
    isError = true;

    swalMessage({
      type: "warning",
      title:
        "Invalid Input. Please select the primary insurance details properly."
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
      title:
        "Invalid Input. Please select the secondary insurance details properly."
    });

    return isError;
  } else if (
    state.state.patient_type === null ||
    state.state.patient_type === ""
  ) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Invalid Input. Please select the Patient Type."
    });
    return isError;
  } else if (state.state.unbalanced_amount > 0) {
    isError = true;

    swalMessage({
      type: "warning",
      title:
        "Invalid Input. Total receipt amount should be equal to reciveable amount."
    });

    return isError;
  } else if (state.state.shift_id === null) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Invalid Input. Shift is Mandatory."
    });

    return isError;
  } else if (state.state.counter_id === null) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Invalid Input. Counter is Mandatory."
    });

    return isError;
  }
}
