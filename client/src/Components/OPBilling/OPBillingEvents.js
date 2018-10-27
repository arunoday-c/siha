import extend from "extend";
import PatRegIOputs from "../../Models/RegistrationPatient";
import BillingIOputs from "../../Models/Billing";

const ClearData = ($this, e) => {
  let IOputs = extend(PatRegIOputs.inputParam(), BillingIOputs.inputParam());
  IOputs.patient_payable_h = 0;
  $this.setState({ ...$this.state, ...IOputs });
};

const Validations = $this => {
  let isError = false;

  debugger;

  if ($this.state.card_amount > 0) {
    if ($this.state.card_number == null || $this.state.card_number == "") {
      isError = true;
      $this.setState({
        open: true,
        MandatoryMsg: "Invalid. Card Number cannot be blank."
      });
      document.querySelector("[name='card_number']").focus();
      return isError;
    }

    if ($this.state.card_date == null || $this.state.card_date == "") {
      isError = true;
      $this.setState({
        open: true,
        MandatoryMsg: "Invalid. Card Date Cannot be blank."
      });
      document.querySelector("[name='card_date']").focus();
      return isError;
    }
  } else if ($this.state.cheque_amount > 0) {
    if ($this.state.cheque_number == null || $this.state.cheque_number == "") {
      isError = true;
      $this.setState({
        open: true,
        MandatoryMsg: "Invalid Input. Check Number cannot be blank."
      });
      document.querySelector("[name='cheque_number']").focus();
      return isError;
    }

    if ($this.state.cheque_date == null || $this.state.cheque_date == "") {
      isError = true;
      $this.setState({
        open: true,
        MandatoryMsg: "Invalid Input. Cheque Date Cannot be blank."
      });
      document.querySelector("[name='cheque_date']").focus();
      return isError;
    }
  } else if ($this.state.unbalanced_amount > 0) {
    isError = true;

    $this.setState({
      open: true,
      MandatoryMsg:
        "Invalid Input. Total receipt amount should be equal to reciveable amount."
    });

    return isError;
  } else if ($this.state.shift_id === null) {
    isError = true;

    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Shift is Mandatory."
    });

    return isError;
  } else if ($this.state.counter_id === null) {
    isError = true;

    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Counter is Mandatory."
    });

    return isError;
  }
};

export { ClearData, Validations };
