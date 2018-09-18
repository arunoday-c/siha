import { successfulMessage } from "../../utils/GlobalFunctions";

export function Validations(state) {
  let isError = false;

  if (state.state.full_name.length <= 0) {
    isError = true;
    state.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Name Cannot be blank."
    });
    document.querySelector("[name='full_name']").focus();
    return isError;
  }

  if (state.state.title_id <= 0) {
    isError = true;
    state.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Title Cannot be blank."
    });
    return isError;
  }

  if (state.state.primary_identity_id <= 0) {
    isError = true;
    state.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Primary ID Cannot be blank."
    });
    return isError;
  }

  if (state.state.primary_id_no.length <= 0) {
    isError = true;
    state.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Primary ID No. Cannot be blank."
    });
    document.querySelector("[name='primary_id_no']").focus();
    return isError;
  }

  if (state.state.nationality_id <= 0) {
    isError = true;
    state.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Nationality Cannot be blank."
    });
    return isError;
  }

  if (state.state.country_id <= 0) {
    isError = true;
    state.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Country Cannot be blank."
    });
    return isError;
  }

  if (state.state.contact_number <= 0) {
    isError = true;
    state.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Mobile No. Cannot be blank."
    });
    document.querySelector("[name='contact_number']").focus();
    return isError;
  }

  if (state.state.card_amount > 0) {
    if (state.state.card_number == null || state.state.card_number == "") {
      isError = true;
      state.setState({
        open: true,
        MandatoryMsg: "Invalid. Card Number cannot be blank."
      });
      document.querySelector("[name='card_number']").focus();
      return isError;
    }

    if (state.state.card_date == null || state.state.card_date == "") {
      isError = true;
      state.setState({
        open: true,
        MandatoryMsg: "Invalid. Card Date Cannot be blank."
      });
      document.querySelector("[name='card_date']").focus();
      return isError;
    }
  }

  if (state.state.cheque_amount > 0) {
    if (state.state.cheque_number == null || state.state.cheque_number == "") {
      isError = true;
      state.setState({
        open: true,
        MandatoryMsg: "Invalid Input. Check Number cannot be blank."
      });
      document.querySelector("[name='cheque_number']").focus();
      return isError;
    }

    if (state.state.cheque_date == null || state.state.cheque_date == "") {
      isError = true;
      state.setState({
        open: true,
        MandatoryMsg: "Invalid Input. Cheque Date Cannot be blank."
      });
      document.querySelector("[name='cheque_date']").focus();
      return isError;
    }
  }

  if (
    state.state.insured == "Y" &&
    (state.state.primary_insurance_provider_id == null ||
      state.state.primary_network_office_id == null ||
      state.state.primary_network_id == null)
  ) {
    successfulMessage({
      message:
        "Invalid Input. Please select the primary insurance details properly.",
      title: "Error",
      icon: "error"
    });
  } else if (
    state.state.sec_insured == "Y" &&
    (state.state.secondary_insurance_provider_id == null ||
      state.state.secondary_network_office_id == null ||
      state.state.secondary_network_id == null)
  ) {
    successfulMessage({
      message:
        "Invalid Input. Please select the secondary insurance details properly.",
      title: "Error",
      icon: "error"
    });
  }
  debugger;
  if (state.state.patient_type === null) {
    isError = true;
    state.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Please select the Patient Type."
    });
    return isError;
  }

  if (state.state.unbalanced_amount > 0) {
    isError = true;

    successfulMessage({
      message:
        "Invalid Input. Total receipt amount should be equal to reciveable amount.",
      title: "Warning",
      icon: "warning"
    });

    return isError;
  }
}
