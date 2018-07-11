import { successfulMessage } from "../../utils/GlobalFunctions";

export function Validations(state) {
  let isError = false;
  debugger;
  if (state.state.full_name.length <= 0) {
    isError = true;
    state.setState({
      open: true,
      MandatoryMsg: "Invalid. Name Cannot be blank."
    });
    document.querySelector("[name='full_name']").focus();
    return isError;
  }

  if (state.state.title_id <= 0) {
    isError = true;
    state.setState({
      open: true,
      MandatoryMsg: "Invalid. Title Cannot be blank."
    });
    return isError;
  }

  // if (state.state.date_of_birth <= 0) {
  //     isError = true;
  //     state.setState({
  //         open: true,
  //         MandatoryMsg: "Invalid. DOB Cannot be blank."
  //     });
  //     return isError;
  // }

  if (state.state.primary_identity_id <= 0) {
    isError = true;
    state.setState({
      open: true,
      MandatoryMsg: "Invalid. Primary ID Cannot be blank."
    });
    return isError;
  }

  if (state.state.primary_id_no.length <= 0) {
    isError = true;
    state.setState({
      open: true,
      MandatoryMsg: "Invalid. Primary ID No. Cannot be blank."
    });
    document.querySelector("[name='primary_id_no']").focus();
    return isError;
  }

  if (state.state.nationality_id <= 0) {
    isError = true;
    state.setState({
      open: true,
      MandatoryMsg: "Invalid. Nationality Cannot be blank."
    });
    return isError;
  }

  if (state.state.country_id <= 0) {
    isError = true;
    state.setState({
      open: true,
      MandatoryMsg: "Invalid. Country Cannot be blank."
    });
    return isError;
  }

  if (state.state.counter_id == null) {
    isError = true;
    state.setState({
      open: true,
      MandatoryMsg: "Invalid. Counter ID Cannot be blank."
    });
    return isError;
  }

  if (state.state.shift_id == null) {
    isError = true;
    state.setState({
      open: true,
      MandatoryMsg: "Invalid. Shift ID Cannot be blank."
    });
    return isError;
  }

  if (state.state.contact_number <= 0) {
    isError = true;
    state.setState({
      open: true,
      MandatoryMsg: "Invalid. Mobile No. Cannot be blank."
    });
    return isError;
  }

  if (state.state.card_amount > 0) {
    if (state.state.card_number == null || state.state.card_number == "") {
      isError = true;
      state.setState({
        open: true,
        MandatoryMsg: "Invalid. Card Number cannot be blank."
      });
      return isError;
    }

    if (state.state.card_date == null || state.state.card_date == "") {
      isError = true;
      state.setState({
        open: true,
        MandatoryMsg: "Invalid. Card Date Cannot be blank."
      });
      return isError;
    }
  }

  if (state.state.cheque_amount > 0) {
    if (state.state.cheque_number == null || state.state.cheque_number == "") {
      isError = true;
      state.setState({
        open: true,
        MandatoryMsg: "Invalid. Check Number cannot be blank."
      });
      return isError;
    }

    if (state.state.cheque_date == null || state.state.cheque_date == "") {
      isError = true;
      state.setState({
        open: true,
        MandatoryMsg: "Invalid. Cheque Date Cannot be blank."
      });
      return isError;
    }
  }
  debugger;
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
